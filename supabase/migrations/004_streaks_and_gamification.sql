-- ============================================================
-- Migration 004: Streaks & Gamification
-- MeisterUp — Zero-Syntax Gym
--
-- Streak tracking, XP ledger, badges, and leaderboard views.
-- Gamification drives daily engagement.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. USER STREAKS
-- Tracks consecutive days of practice.
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_streaks (
  user_id           uuid primary key references public.profiles(id) on delete cascade,
  
  current_streak    integer default 0,
  longest_streak    integer default 0,
  
  -- Last practice date (UTC, date only for streak counting)
  last_practice_date date,
  
  -- Streak freeze (one free pass per purchase/reward)
  streak_freezes_available integer default 0,
  last_freeze_used_at      timestamptz,
  
  updated_at        timestamptz default now()
);

alter table public.user_streaks enable row level security;

create policy "Users can view own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can update own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id);

create policy "Users can insert own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

-- Leaderboard: allow reading streaks of opted-in users
create policy "Leaderboard streak visibility"
  on public.user_streaks for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = user_id
      and profiles.leaderboard_opt_in = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- 2. XP LEDGER
-- Every XP transaction is logged for auditability.
-- ────────────────────────────────────────────────────────────

create table if not exists public.xp_ledger (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  
  amount          integer not null,                    -- Can be negative for penalties
  reason          text not null check (reason in (
                    'card_correct',       -- Answered a card correctly
                    'streak_bonus',       -- Daily streak bonus
                    'session_complete',   -- Completed a full session
                    'badge_earned',       -- Badge reward
                    'assessment_bonus',   -- Onboarding assessment reward
                    'challenge_win',      -- Won a timed challenge
                    'daily_goal',         -- Completed daily goal
                    'admin_adjustment'    -- Manual adjustment
                  )),
  
  -- Context
  session_id      uuid references public.sessions(id) on delete set null,
  card_id         uuid references public.cards(id) on delete set null,
  skill_id        uuid references public.skills(id) on delete set null,
  
  created_at      timestamptz default now()
);

alter table public.xp_ledger enable row level security;

create policy "Users can view own XP ledger"
  on public.xp_ledger for select
  using (auth.uid() = user_id);

create policy "Users can insert own XP entries"
  on public.xp_ledger for insert
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 3. BADGES
-- Definition table for all earnable badges.
-- ────────────────────────────────────────────────────────────

create table if not exists public.badges (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,                -- e.g. 'first-blood', 'streak-7'
  name            text not null,                       -- e.g. 'First Blood'
  description     text not null,                       -- e.g. 'Answer your first card correctly'
  icon_name       text,                                -- Lucide icon name
  category        text default 'general' check (category in (
                    'general',           -- Generic milestones
                    'streak',            -- Streak-based
                    'mastery',           -- Skill mastery milestones
                    'social',            -- Leaderboard / community
                    'rare'               -- Special / hidden achievements
                  )),
  
  -- Requirement (simple threshold-based)
  requirement_type  text check (requirement_type in (
                    'streak_days',       -- current_streak >= threshold
                    'total_xp',          -- total XP >= threshold
                    'cards_correct',     -- total correct answers >= threshold
                    'skills_started',    -- skills with progress >= threshold
                    'concepts_mastered', -- total mastered concepts >= threshold
                    'custom'             -- special logic
                  )),
  requirement_threshold integer,
  
  -- Rarity for display
  rarity          text default 'common' check (rarity in (
                    'common', 'uncommon', 'rare', 'epic', 'legendary'
                  )),
  
  xp_reward       integer default 0,                   -- XP granted when badge is earned
  
  created_at      timestamptz default now()
);

alter table public.badges enable row level security;

create policy "Badges are public"
  on public.badges for select
  using (true);

-- ────────────────────────────────────────────────────────────
-- 4. USER BADGES (earned)
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_badges (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  badge_id        uuid not null references public.badges(id) on delete cascade,
  
  earned_at       timestamptz default now(),
  
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "Users can view own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- Public badge visibility for public profiles
create policy "Public profile badges are viewable"
  on public.user_badges for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = user_id
      and profiles.profile_public = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- 5. DAILY GOALS
-- Configurable daily targets.
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_daily_goals (
  user_id             uuid primary key references public.profiles(id) on delete cascade,
  
  target_sessions     integer default 1,               -- Sessions per day
  target_xp           integer default 50,              -- XP per day
  target_cards        integer default 10,              -- Cards per day
  
  updated_at          timestamptz default now()
);

alter table public.user_daily_goals enable row level security;

create policy "Users can view own daily goals"
  on public.user_daily_goals for select
  using (auth.uid() = user_id);

create policy "Users can update own daily goals"
  on public.user_daily_goals for update
  using (auth.uid() = user_id);

create policy "Users can insert own daily goals"
  on public.user_daily_goals for insert
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 6. LEADERBOARD VIEW
-- Materialized view for weekly leaderboard performance.
-- ────────────────────────────────────────────────────────────

create or replace view public.weekly_leaderboard as
select
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  coalesce(sum(xl.amount), 0) as weekly_xp,
  us.current_streak,
  count(distinct sr.id) filter (where sr.is_correct) as weekly_correct,
  rank() over (order by coalesce(sum(xl.amount), 0) desc) as rank
from public.profiles p
left join public.xp_ledger xl
  on xl.user_id = p.id
  and xl.created_at >= date_trunc('week', now())
left join public.user_streaks us
  on us.user_id = p.id
left join public.session_results sr
  on sr.user_id = p.id
  and sr.answered_at >= date_trunc('week', now())
where p.leaderboard_opt_in = true
group by p.id, p.display_name, p.avatar_url, us.current_streak
order by weekly_xp desc
limit 100;

-- ────────────────────────────────────────────────────────────
-- 7. SEED BADGES
-- ────────────────────────────────────────────────────────────

insert into public.badges (slug, name, description, category, requirement_type, requirement_threshold, rarity, xp_reward) values
  ('first-card',     'First Card',        'Answer your first card',                    'general',  'cards_correct',     1,    'common',    10),
  ('streak-3',       'Three-Peat',        'Maintain a 3-day streak',                   'streak',   'streak_days',       3,    'common',    25),
  ('streak-7',       'Weekly Warrior',    'Maintain a 7-day streak',                   'streak',   'streak_days',       7,    'uncommon',  50),
  ('streak-30',      'Monthly Master',    'Maintain a 30-day streak',                  'streak',   'streak_days',       30,   'rare',      200),
  ('streak-100',     'Century Club',      'Maintain a 100-day streak',                 'streak',   'streak_days',       100,  'legendary', 1000),
  ('xp-1000',        'Kilobyte',          'Earn 1,000 total XP',                       'general',  'total_xp',          1000, 'common',    50),
  ('xp-10000',       'Megabyte',          'Earn 10,000 total XP',                      'general',  'total_xp',          10000,'rare',      250),
  ('concepts-10',    'Building Blocks',   'Master 10 concepts',                        'mastery',  'concepts_mastered', 10,   'common',    50),
  ('concepts-50',    'Architect',         'Master 50 concepts',                        'mastery',  'concepts_mastered', 50,   'uncommon',  150),
  ('concepts-100',   'Polyglot',          'Master 100 concepts',                       'mastery',  'concepts_mastered', 100,  'rare',      500),
  ('skills-3',       'Renaissance Dev',   'Start learning 3 different skills',         'mastery',  'skills_started',    3,    'uncommon',  100),
  ('cards-100',      'Centurion',         'Answer 100 cards correctly',                'general',  'cards_correct',     100,  'uncommon',  100),
  ('cards-500',      'Code Reviewer',     'Answer 500 cards correctly',                'general',  'cards_correct',     500,  'rare',      300)
on conflict (slug) do nothing;

-- ────────────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────────────

create index idx_xp_ledger_user on public.xp_ledger(user_id);
create index idx_xp_ledger_created on public.xp_ledger(created_at desc);
create index idx_xp_ledger_user_week on public.xp_ledger(user_id, created_at desc);
create index idx_user_badges_user on public.user_badges(user_id);

-- Updated_at triggers
create trigger user_streaks_updated_at
  before update on public.user_streaks
  for each row execute procedure public.set_updated_at();

create trigger user_daily_goals_updated_at
  before update on public.user_daily_goals
  for each row execute procedure public.set_updated_at();
