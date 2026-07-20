-- ============================================================
-- Migration 002: Skills & Concept Graph
-- MeisterUp — Zero-Syntax Gym
--
-- The concept graph is the backbone of the adaptive engine.
-- Concepts are nodes with prerequisites (edges), enabling
-- cross-language dependency mapping per the Zero-Syntax philosophy.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. SKILLS
-- Top-level skill trees (Python, TypeScript, System Design, etc.)
-- ────────────────────────────────────────────────────────────

create table if not exists public.skills (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,                -- e.g. 'python', 'system-design'
  name            text not null,                       -- e.g. 'Python'
  category        text not null,                       -- e.g. 'Languages', 'Architecture'
  description     text,
  icon_name       text,                                -- Lucide icon name for frontend
  color_from      text,                                -- Tailwind gradient start
  color_to        text,                                -- Tailwind gradient end
  total_concepts  integer default 0,
  estimated_hours numeric(5,1) default 0,
  learner_count   integer default 0,                   -- denormalized for display
  is_published    boolean default false,
  
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.skills enable row level security;

-- Anyone can browse published skills (SEO-friendly)
create policy "Published skills are public"
  on public.skills for select
  using (is_published = true);

-- ────────────────────────────────────────────────────────────
-- 2. CONCEPTS
-- Individual knowledge nodes within a skill tree.
-- Each concept belongs to one skill but may map to concepts
-- in other skills via concept_links (cross-language mapping).
-- ────────────────────────────────────────────────────────────

create table if not exists public.concepts (
  id              uuid primary key default gen_random_uuid(),
  skill_id        uuid not null references public.skills(id) on delete cascade,
  
  slug            text not null,                       -- e.g. 'context-managers'
  name            text not null,                       -- e.g. 'Context Managers'
  description     text,
  explanation     text,                                -- Detailed markdown explanation
  
  -- Difficulty & ordering
  difficulty      smallint default 1 check (difficulty between 1 and 5),
  sort_order      integer default 0,
  
  -- Concept category within the skill
  topic_group     text,                                -- e.g. 'Resource Management', 'OOP'
  
  -- AI failure mode tags (Zero-Syntax philosophy)
  -- Cards targeting this concept can be filtered by failure mode
  failure_modes   text[] default '{}',                 -- e.g. {'hallucination', 'race_condition', 'perf_trap'}
  
  is_published    boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  
  unique(skill_id, slug)
);

alter table public.concepts enable row level security;

create policy "Published concepts are public"
  on public.concepts for select
  using (is_published = true);

-- ────────────────────────────────────────────────────────────
-- 3. CONCEPT PREREQUISITES (Directed Graph Edges)
-- "To learn concept B, you should first understand concept A."
-- This is what makes the knowledge graph non-linear.
-- ────────────────────────────────────────────────────────────

create table if not exists public.concept_prerequisites (
  id              uuid primary key default gen_random_uuid(),
  concept_id      uuid not null references public.concepts(id) on delete cascade,
  prerequisite_id uuid not null references public.concepts(id) on delete cascade,
  
  -- Strength of dependency: 'required' vs 'recommended'
  strength        text default 'required' check (strength in ('required', 'recommended')),
  
  created_at      timestamptz default now(),
  
  unique(concept_id, prerequisite_id),
  check(concept_id != prerequisite_id)
);

alter table public.concept_prerequisites enable row level security;

create policy "Prerequisites are public"
  on public.concept_prerequisites for select
  using (true);

-- ────────────────────────────────────────────────────────────
-- 4. CROSS-LANGUAGE CONCEPT LINKS
-- "Python's context managers ↔ C#'s IDisposable ↔ Rust's Drop"
-- Enables transferable knowledge crediting.
-- ────────────────────────────────────────────────────────────

create table if not exists public.concept_links (
  id              uuid primary key default gen_random_uuid(),
  concept_a_id    uuid not null references public.concepts(id) on delete cascade,
  concept_b_id    uuid not null references public.concepts(id) on delete cascade,
  
  -- How related they are (0.0 = unrelated, 1.0 = equivalent)
  transfer_weight numeric(3,2) default 0.5 check (transfer_weight between 0 and 1),
  
  -- Relationship type
  link_type       text default 'equivalent' check (link_type in (
                    'equivalent',      -- Same concept, different syntax (e.g. try/except vs try/catch)
                    'analogous',       -- Similar pattern (e.g. Python generators ↔ JS generators)
                    'builds_on'        -- One is a deeper version (e.g. basic async ↔ advanced concurrency)
                  )),
  
  created_at      timestamptz default now(),
  
  unique(concept_a_id, concept_b_id),
  check(concept_a_id != concept_b_id)
);

alter table public.concept_links enable row level security;

create policy "Concept links are public"
  on public.concept_links for select
  using (true);

-- ────────────────────────────────────────────────────────────
-- 5. USER SKILL PROGRESS
-- Per-user, per-skill mastery tracking.
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_skill_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  skill_id        uuid not null references public.skills(id) on delete cascade,
  
  -- Aggregate metrics
  mastery_pct     numeric(5,2) default 0,              -- 0.00 to 100.00
  concepts_mastered integer default 0,
  total_xp        integer default 0,
  
  -- Status
  status          text default 'active' check (status in ('active', 'paused', 'completed')),
  
  -- Assessment state
  assessment_completed_at timestamptz,
  
  started_at      timestamptz default now(),
  last_practiced  timestamptz default now(),
  updated_at      timestamptz default now(),
  
  unique(user_id, skill_id)
);

alter table public.user_skill_progress enable row level security;

create policy "Users can view own skill progress"
  on public.user_skill_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own skill progress"
  on public.user_skill_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own skill progress"
  on public.user_skill_progress for update
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 6. USER CONCEPT MASTERY
-- Per-user, per-concept mastery tracking.
-- This is the core of the Bayesian mastery model.
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_concept_mastery (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  concept_id      uuid not null references public.concepts(id) on delete cascade,
  
  -- Mastery state (Bayesian Knowledge Tracing)
  mastery_probability  numeric(5,4) default 0.0,       -- P(mastered) 0.0000 to 1.0000
  
  -- Expert's Dilemma tracking (Zero-Syntax philosophy)
  -- High confidence + low accuracy = confidence gap
  self_reported_confidence numeric(3,2) default 0.5,   -- User's self-assessment 0.00 to 1.00
  actual_accuracy          numeric(3,2) default 0.0,   -- Measured accuracy 0.00 to 1.00
  confidence_gap           numeric(3,2) generated always as (
    self_reported_confidence - actual_accuracy
  ) stored,
  
  -- State
  state           text default 'unseen' check (state in (
                    'unseen',          -- Never encountered
                    'learning',        -- Encountered but not mastered
                    'mastered',        -- P(mastered) > threshold
                    'review_due',      -- Mastered but needs spaced repetition review
                    'transferred'      -- Credited from another skill via concept_links
                  )),
  
  -- Spaced repetition
  next_review_at  timestamptz,
  review_interval_days integer default 1,
  
  -- Stats
  times_seen      integer default 0,
  times_correct   integer default 0,
  
  last_seen_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  
  unique(user_id, concept_id)
);

alter table public.user_concept_mastery enable row level security;

create policy "Users can view own concept mastery"
  on public.user_concept_mastery for select
  using (auth.uid() = user_id);

create policy "Users can insert own concept mastery"
  on public.user_concept_mastery for insert
  with check (auth.uid() = user_id);

create policy "Users can update own concept mastery"
  on public.user_concept_mastery for update
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────────────

create index idx_concepts_skill on public.concepts(skill_id);
create index idx_concept_prereqs_concept on public.concept_prerequisites(concept_id);
create index idx_concept_prereqs_prereq on public.concept_prerequisites(prerequisite_id);
create index idx_user_skill_progress_user on public.user_skill_progress(user_id);
create index idx_user_concept_mastery_user on public.user_concept_mastery(user_id);
create index idx_user_concept_mastery_concept on public.user_concept_mastery(concept_id);
create index idx_user_concept_mastery_review on public.user_concept_mastery(next_review_at) 
  where state = 'review_due';

-- Updated_at triggers
create trigger skills_updated_at
  before update on public.skills
  for each row execute procedure public.set_updated_at();

create trigger concepts_updated_at
  before update on public.concepts
  for each row execute procedure public.set_updated_at();

create trigger user_skill_progress_updated_at
  before update on public.user_skill_progress
  for each row execute procedure public.set_updated_at();

create trigger user_concept_mastery_updated_at
  before update on public.user_concept_mastery
  for each row execute procedure public.set_updated_at();
