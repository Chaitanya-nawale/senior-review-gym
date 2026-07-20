-- ============================================================
-- Migration 003: Cards & Sessions
-- MeisterUp — Zero-Syntax Gym
--
-- Cards are the atomic learning units. Sessions group card
-- interactions into timed practice runs. Results capture
-- not just correctness but *reasoning* (Zero-Syntax philosophy).
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CARDS
-- The content table. Each card tests one concept with a
-- specific interaction type.
-- ────────────────────────────────────────────────────────────

create table if not exists public.cards (
  id              uuid primary key default gen_random_uuid(),
  concept_id      uuid not null references public.concepts(id) on delete cascade,
  
  -- Card type (extended for Zero-Syntax philosophy)
  card_type       text not null check (card_type in (
                    -- Existing types
                    'code-review',        -- Swipe approve/reject
                    'concept',            -- Multiple choice concept check
                    'predict-output',     -- What does this code print?
                    'fill-blank',         -- Complete the missing code
                    
                    -- New Zero-Syntax types
                    'ai-audit',           -- Spot the AI hallucination/vuln
                    'race-condition',     -- Identify the timing bug
                    'perf-trap',          -- Find the hidden O(n²) / N+1 query
                    'system-decision',    -- Architecture tradeoff under constraint
                    'explain-back'        -- Teach the concept back in your own words
                  )),
  
  -- Content (JSON-flexible to support all card types)
  title           text not null,
  lang            text,                                -- Programming language
  code            text,                                -- Code snippet (may contain ___ for fill-blank)
  question        text,                                -- Question text (for concept / system-decision)
  
  -- Answer options (null for code-review and explain-back)
  options         jsonb,                               -- Array of option strings
  correct_index   integer,                             -- Index into options array (0-based)
  
  -- For code-review / ai-audit cards
  is_bad_code     boolean,                             -- true = should be rejected
  
  -- Explanation shown after answering
  explanation     text not null,                       -- "why" field from current cards
  
  -- AI failure mode metadata (for ai-audit, race-condition, perf-trap)
  failure_mode    text check (failure_mode in (
                    'hallucination',      -- AI generated plausible but wrong code
                    'security_vuln',      -- Missing auth, injection, etc.
                    'race_condition',     -- Subtle timing / concurrency bug
                    'perf_trap',          -- O(n²) hidden in elegant code
                    'logic_error',        -- Off-by-one, wrong comparison, etc.
                    'type_confusion',     -- Wrong type assumption
                    null                  -- Not applicable for non-audit cards
                  )),
  
  -- Source attribution
  source          text,                                -- e.g. 'anonymized_pr', 'curated', 'ai_generated'
  
  -- Difficulty
  difficulty      smallint default 1 check (difficulty between 1 and 5),
  
  -- Audience targeting
  min_experience  text check (min_experience in ('0-2y', '2-5y', '5-10y', '10y+', null)),
  
  is_published    boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.cards enable row level security;

create policy "Published cards are readable"
  on public.cards for select
  using (is_published = true);

-- ────────────────────────────────────────────────────────────
-- 2. SESSIONS
-- A practice session groups multiple card interactions.
-- Tracks duration and overall performance.
-- ────────────────────────────────────────────────────────────

create table if not exists public.sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  skill_id        uuid not null references public.skills(id) on delete cascade,
  
  -- Session type
  session_type    text default 'practice' check (session_type in (
                    'practice',          -- Normal gym session
                    'assessment',        -- Onboarding adaptive assessment
                    'review',            -- Spaced repetition review
                    'challenge'          -- Timed challenge mode
                  )),
  
  -- Timing
  started_at      timestamptz default now(),
  completed_at    timestamptz,
  duration_seconds integer,
  
  -- Aggregate results
  cards_seen      integer default 0,
  cards_correct   integer default 0,
  xp_earned       integer default 0,
  
  -- Concepts touched in this session
  concepts_practiced uuid[] default '{}',
  
  created_at      timestamptz default now()
);

alter table public.sessions enable row level security;

create policy "Users can view own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.sessions for update
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 3. SESSION RESULTS (Per-Card Answers)
-- Each row = one card interaction within a session.
-- Captures reasoning for Zero-Syntax philosophy.
-- ────────────────────────────────────────────────────────────

create table if not exists public.session_results (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  card_id         uuid not null references public.cards(id) on delete cascade,
  concept_id      uuid not null references public.concepts(id) on delete cascade,
  
  -- What the user did
  answer_index    integer,                             -- Selected option index (for MCQ types)
  swipe_direction text check (swipe_direction in ('left', 'right', null)),
  
  -- Reasoning capture (Zero-Syntax: "grades reasoning, not just answers")
  user_reasoning  text,                                -- Free-text explanation from user
  reasoning_quality numeric(3,2),                      -- AI-graded quality 0.00–1.00 (for explain-back)
  
  -- Result
  is_correct      boolean not null,
  xp_earned       integer default 0,
  
  -- Confidence self-report
  confidence      text check (confidence in ('sure', 'maybe', 'guess', null)),
  
  -- Time spent on this card
  time_spent_ms   integer,
  
  answered_at     timestamptz default now()
);

alter table public.session_results enable row level security;

create policy "Users can view own results"
  on public.session_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own results"
  on public.session_results for insert
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────────────

create index idx_cards_concept on public.cards(concept_id);
create index idx_cards_type on public.cards(card_type);
create index idx_cards_difficulty on public.cards(difficulty);
create index idx_cards_failure_mode on public.cards(failure_mode) where failure_mode is not null;

create index idx_sessions_user on public.sessions(user_id);
create index idx_sessions_skill on public.sessions(skill_id);
create index idx_sessions_started on public.sessions(started_at desc);

create index idx_session_results_session on public.session_results(session_id);
create index idx_session_results_user on public.session_results(user_id);
create index idx_session_results_card on public.session_results(card_id);
create index idx_session_results_concept on public.session_results(concept_id);

-- Updated_at triggers
create trigger cards_updated_at
  before update on public.cards
  for each row execute procedure public.set_updated_at();
