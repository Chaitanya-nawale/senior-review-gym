/* ============================================================
   src/lib/types.ts
   Shared TypeScript interfaces mirroring the Supabase DB schema.
   Import from here — never redefine inline in components.
   ============================================================ */

/* ── Skills ── */

export interface Skill {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  icon_name: string | null;
  color_from: string | null;
  color_to: string | null;
  total_concepts: number;
  estimated_hours: number;
  learner_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Concepts ── */

export interface Concept {
  id: string;
  skill_id: string;
  slug: string;
  name: string;
  description: string | null;
  explanation: string | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  sort_order: number;
  topic_group: string | null;
  failure_modes: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Cards ── */

export type CardType =
  | "code-review"
  | "concept"
  | "predict-output"
  | "fill-blank"
  | "ai-audit"
  | "race-condition"
  | "perf-trap"
  | "system-decision"
  | "explain-back";

export type FailureMode =
  | "hallucination"
  | "security_vuln"
  | "race_condition"
  | "perf_trap"
  | "logic_error"
  | "type_confusion"
  | null;

export interface Card {
  id: string;
  concept_id: string;
  card_type: CardType;
  title: string;
  lang: string | null;
  code: string | null;
  question: string | null;
  options: string[] | null;
  correct_index: number | null;
  is_bad_code: boolean | null;
  explanation: string;
  failure_mode: FailureMode;
  source: string | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  min_experience: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined from concepts table (when queried with concept join)
  concept?: Pick<Concept, "name" | "slug" | "topic_group">;
}

/* ── Sessions ── */

export type SessionType = "practice" | "assessment" | "review" | "challenge";

export interface Session {
  id: string;
  user_id: string;
  skill_id: string;
  session_type: SessionType;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  cards_seen: number;
  cards_correct: number;
  xp_earned: number;
  concepts_practiced: string[];
  created_at: string;
}

export interface SessionResult {
  id: string;
  session_id: string;
  user_id: string;
  card_id: string;
  concept_id: string;
  answer_index: number | null;
  swipe_direction: "left" | "right" | null;
  user_reasoning: string | null;
  reasoning_quality: number | null;
  is_correct: boolean;
  xp_earned: number;
  confidence: "sure" | "maybe" | "guess" | null;
  time_spent_ms: number | null;
  answered_at: string;
}

/* ── User Progress ── */

export interface UserSkillProgress {
  id: string;
  user_id: string;
  skill_id: string;
  mastery_pct: number;
  concepts_mastered: number;
  total_xp: number;
  status: "active" | "paused" | "completed";
  assessment_completed_at: string | null;
  started_at: string;
  last_practiced: string;
  updated_at: string;
}

export interface UserConceptMastery {
  id: string;
  user_id: string;
  concept_id: string;
  mastery_probability: number;
  self_reported_confidence: number;
  actual_accuracy: number;
  confidence_gap: number;
  state: "unseen" | "learning" | "mastered" | "review_due" | "transferred";
  next_review_at: string | null;
  review_interval_days: number;
  times_seen: number;
  times_correct: number;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

/* ── Profile ── */

export type UserRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "sre"
  | "data"
  | "ml"
  | "mobile"
  | "security"
  | "engineering_manager"
  | "tech_lead"
  | "other";

export type ExperienceBand = "0-2y" | "2-5y" | "5-10y" | "10y+";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole | null;
  experience_band: ExperienceBand | null;
  onboarding_completed_at: string | null;
  profile_public: boolean;
  leaderboard_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Streaks / Gamification ── */

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string | null;
  streak_freezes_available: number;
  last_freeze_used_at: string | null;
  updated_at: string;
}

export interface XPEntry {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  session_id: string | null;
  card_id: string | null;
  skill_id: string | null;
  created_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string | null;
  category: "general" | "streak" | "mastery" | "social" | "rare";
  requirement_type: string | null;
  requirement_threshold: number | null;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  xp_reward: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface UserDailyGoals {
  user_id: string;
  target_sessions: number;
  target_xp: number;
  target_cards: number;
  updated_at: string;
}

export interface UserNotificationPrefs {
  user_id: string;
  daily_reminder: boolean;
  daily_reminder_time: string;
  weekly_summary_email: boolean;
  streak_warning: boolean;
  new_skill_alerts: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Leaderboard ── */

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  weekly_xp: number;
  current_streak: number;
  weekly_correct: number;
  rank: number;
}

/* ── Dashboard ── */

export interface DashboardStats {
  streak: number;
  streakFreezes: number;
  totalXP: number;
  weeklyXP: number;
  masteryPct: number;
  masteryDelta: number;
  conceptsMastered: number;
  totalConcepts: number;
}

export interface ContinueLearningItem {
  skill_id: string;
  skill_name: string;
  skill_slug: string;
  concept_name: string;
  concept_slug: string;
  progress: number;
  reason: string;
  estimatedMinutes: number;
  color_from: string;
  color_to: string;
}

/* ── Skill Enrollment (Migration 006) ── */

export interface UserSkillEnrollment {
  user_id: string;
  skill_id: string;
  enrolled_at: string;
}
