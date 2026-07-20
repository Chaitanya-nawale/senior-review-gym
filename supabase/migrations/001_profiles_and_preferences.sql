-- ============================================================
-- Migration 001: Profiles & Preferences
-- MeisterUp — Zero-Syntax Gym
-- 
-- Run this in Supabase SQL Editor (or via CLI: supabase db push)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
-- Extends auth.users with app-specific profile data.
-- Auto-created on sign-up via trigger.
-- ────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  
  -- Display info
  display_name  text,
  avatar_url    text,
  bio           text,
  
  -- Role & experience (set during onboarding)
  role          text check (role in (
                  'frontend', 'backend', 'fullstack', 'devops', 'sre',
                  'data', 'ml', 'mobile', 'security', 'engineering_manager',
                  'tech_lead', 'other'
                )),
  experience_band text check (experience_band in (
                  '0-2y', '2-5y', '5-10y', '10y+'
                )),
  
  -- Onboarding state
  onboarding_completed_at  timestamptz,
  
  -- Privacy
  profile_public  boolean default false,
  leaderboard_opt_in boolean default true,
  
  -- Timestamps
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Public profiles can be viewed by anyone
create policy "Public profiles are viewable"
  on public.profiles for select
  using (profile_public = true);

-- Users can insert their own profile (for the trigger)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ────────────────────────────────────────────────────────────
-- 2. AUTO-CREATE PROFILE ON SIGN-UP
-- ────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Drop existing trigger if re-running
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 3. USER NOTIFICATION PREFERENCES
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_notification_prefs (
  user_id               uuid primary key references public.profiles(id) on delete cascade,
  
  daily_reminder        boolean default true,
  daily_reminder_time   time default '09:00',
  weekly_summary_email  boolean default true,
  streak_warning        boolean default true,   -- notify before streak breaks
  new_skill_alerts      boolean default false,
  
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

alter table public.user_notification_prefs enable row level security;

create policy "Users can view own notification prefs"
  on public.user_notification_prefs for select
  using (auth.uid() = user_id);

create policy "Users can update own notification prefs"
  on public.user_notification_prefs for update
  using (auth.uid() = user_id);

create policy "Users can insert own notification prefs"
  on public.user_notification_prefs for insert
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 4. UPDATED_AT TRIGGER (reusable)
-- ────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger notification_prefs_updated_at
  before update on public.user_notification_prefs
  for each row execute procedure public.set_updated_at();
