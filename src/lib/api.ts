/* ============================================================
   src/lib/api.ts
   Central typed query layer wrapping Supabase.
   Components must NOT import supabase directly for data queries
   — always go through these functions → hooks.
   ============================================================ */

import { supabase } from "./supabase";
import type {
  Card,
  ContinueLearningItem,
  DashboardStats,
  LeaderboardEntry,
  Profile,
  Session,
  SessionResult,
  SessionType,
  Skill,
  UserDailyGoals,
  UserNotificationPrefs,
  UserSkillProgress,
  UserStreak,
  UserBadge,
  UserSkillEnrollment,
  Concept,
} from "./types";

/* ────────────────────────────────────────────────────────────── */
/*  SKILLS                                                         */
/* ────────────────────────────────────────────────────────────── */

export async function fetchPublishedSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_published", true)
    .order("learner_count", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Skill[]) ?? [];
}

export async function fetchSkillBySlug(slug: string): Promise<Skill | null> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Skill | null;
}

export async function fetchUserSkillProgress(
  userId: string,
): Promise<UserSkillProgress[]> {
  const { data, error } = await supabase
    .from("user_skill_progress")
    .select("*")
    .eq("user_id", userId)
    .order("last_practiced", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as UserSkillProgress[]) ?? [];
}

export async function upsertUserSkillProgress(
  userId: string,
  skillId: string,
): Promise<void> {
  const { error } = await supabase.from("user_skill_progress").upsert(
    {
      user_id: userId,
      skill_id: skillId,
      status: "active",
      last_practiced: new Date().toISOString(),
    },
    { onConflict: "user_id,skill_id", ignoreDuplicates: false },
  );
  if (error) throw new Error(error.message);
}

/* ────────────────────────────────────────────────────────────── */
/*  CONCEPTS                                                        */
/* ────────────────────────────────────────────────────────────── */

export async function fetchConceptsBySkill(skillId: string): Promise<Concept[]> {
  const { data, error } = await supabase
    .from("concepts")
    .select("*")
    .eq("skill_id", skillId)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Concept[]) ?? [];
}

/* ────────────────────────────────────────────────────────────── */
/*  CARDS                                                          */
/* ────────────────────────────────────────────────────────────── */

export async function fetchCardsBySkillId(skillId: string): Promise<Card[]> {
  // Get all concepts for this skill, then fetch their published cards
  const { data: concepts, error: conceptsError } = await supabase
    .from("concepts")
    .select("id")
    .eq("skill_id", skillId)
    .eq("is_published", true);

  if (conceptsError) throw new Error(conceptsError.message);
  if (!concepts?.length) return [];

  const conceptIds = concepts.map((c: { id: string }) => c.id);

  const { data, error } = await supabase
    .from("cards")
    .select(
      `*, concept:concepts(name, slug, topic_group)`,
    )
    .in("concept_id", conceptIds)
    .eq("is_published", true)
    .order("difficulty", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Card[]) ?? [];
}

/* ────────────────────────────────────────────────────────────── */
/*  SESSIONS                                                        */
/* ────────────────────────────────────────────────────────────── */

export async function createSession(
  userId: string,
  skillId: string,
  sessionType: SessionType = "practice",
): Promise<Session> {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      skill_id: skillId,
      session_type: sessionType,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Session;
}

export async function recordCardResult(result: {
  sessionId: string;
  userId: string;
  cardId: string;
  conceptId: string;
  isCorrect: boolean;
  answerIndex?: number;
  swipeDirection?: "left" | "right";
  userReasoning?: string;
  timeSpentMs?: number;
  xpEarned: number;
}): Promise<void> {
  const { error } = await supabase.from("session_results").insert({
    session_id: result.sessionId,
    user_id: result.userId,
    card_id: result.cardId,
    concept_id: result.conceptId,
    is_correct: result.isCorrect,
    answer_index: result.answerIndex ?? null,
    swipe_direction: result.swipeDirection ?? null,
    user_reasoning: result.userReasoning ?? null,
    time_spent_ms: result.timeSpentMs ?? null,
    xp_earned: result.xpEarned,
    answered_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function completeSession(
  sessionId: string,
  stats: {
    cardsSeen: number;
    cardsCorrect: number;
    xpEarned: number;
    conceptsPracticed: string[];
    durationSeconds: number;
  },
): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .update({
      completed_at: new Date().toISOString(),
      cards_seen: stats.cardsSeen,
      cards_correct: stats.cardsCorrect,
      xp_earned: stats.xpEarned,
      concepts_practiced: stats.conceptsPracticed,
      duration_seconds: stats.durationSeconds,
    })
    .eq("id", sessionId);

  if (error) throw new Error(error.message);
}

/* ────────────────────────────────────────────────────────────── */
/*  XP                                                             */
/* ────────────────────────────────────────────────────────────── */

export async function addXPEntry(entry: {
  userId: string;
  amount: number;
  reason: string;
  sessionId?: string;
  cardId?: string;
  skillId?: string;
}): Promise<void> {
  const { error } = await supabase.from("xp_ledger").insert({
    user_id: entry.userId,
    amount: entry.amount,
    reason: entry.reason,
    session_id: entry.sessionId ?? null,
    card_id: entry.cardId ?? null,
    skill_id: entry.skillId ?? null,
    created_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function fetchTotalXP(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("xp_ledger")
    .select("amount")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return (data ?? []).reduce(
    (sum: number, row: { amount: number }) => sum + (row.amount ?? 0),
    0,
  );
}

export async function fetchWeeklyXP(userId: string): Promise<number> {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("xp_ledger")
    .select("amount")
    .eq("user_id", userId)
    .gte("created_at", weekStart.toISOString());

  if (error) throw new Error(error.message);
  return (data ?? []).reduce(
    (sum: number, row: { amount: number }) => sum + (row.amount ?? 0),
    0,
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  USER PROFILE                                                   */
/* ────────────────────────────────────────────────────────────── */

export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Profile | null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<Profile, "display_name" | "bio" | "role" | "experience_band" | "profile_public" | "leaderboard_opt_in" | "onboarding_completed_at">>,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

export async function fetchNotificationPrefs(
  userId: string,
): Promise<UserNotificationPrefs | null> {
  const { data, error } = await supabase
    .from("user_notification_prefs")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as UserNotificationPrefs | null;
}

export async function upsertNotificationPrefs(
  userId: string,
  prefs: Partial<Omit<UserNotificationPrefs, "user_id" | "created_at" | "updated_at">>,
): Promise<void> {
  const { error } = await supabase.from("user_notification_prefs").upsert(
    { user_id: userId, ...prefs, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (error) throw new Error(error.message);
}

/* ────────────────────────────────────────────────────────────── */
/*  STREAK                                                         */
/* ────────────────────────────────────────────────────────────── */

export async function fetchUserStreak(userId: string): Promise<UserStreak | null> {
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as UserStreak | null;
}

export async function updateStreakAfterSession(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: existing } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    // First ever session — create streak row
    await supabase.from("user_streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_practice_date: today,
      streak_freezes_available: 0,
    });
    return;
  }

  const streak = existing as UserStreak;
  const lastDate = streak.last_practice_date;

  if (lastDate === today) {
    // Already practiced today — no change
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak: number;
  if (lastDate === yesterdayStr) {
    // Consecutive day
    newStreak = streak.current_streak + 1;
  } else if (
    lastDate !== today &&
    streak.streak_freezes_available > 0 &&
    streak.last_practice_date
  ) {
    // Check if within freeze window (1 day gap)
    const daysBetween = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (daysBetween === 2) {
      // Freeze covers the gap
      newStreak = streak.current_streak + 1;
      await supabase
        .from("user_streaks")
        .update({
          streak_freezes_available: streak.streak_freezes_available - 1,
          last_freeze_used_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      newStreak = 1;
    }
  } else {
    // Streak broken
    newStreak = 1;
  }

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak.longest_streak),
      last_practice_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

/* ────────────────────────────────────────────────────────────── */
/*  BADGES                                                         */
/* ────────────────────────────────────────────────────────────── */

export async function fetchUserBadges(userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from("user_badges")
    .select("*, badge:badges(*)")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as UserBadge[]) ?? [];
}

/* ────────────────────────────────────────────────────────────── */
/*  DAILY GOALS                                                    */
/* ────────────────────────────────────────────────────────────── */

export async function fetchUserDailyGoals(
  userId: string,
): Promise<UserDailyGoals | null> {
  const { data, error } = await supabase
    .from("user_daily_goals")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as UserDailyGoals | null;
}

/* ────────────────────────────────────────────────────────────── */
/*  LEADERBOARD                                                    */
/* ────────────────────────────────────────────────────────────── */

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("weekly_leaderboard")
    .select("*")
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as LeaderboardEntry[]) ?? [];
}

/* ────────────────────────────────────────────────────────────── */
/*  DASHBOARD                                                      */
/* ────────────────────────────────────────────────────────────── */

export async function fetchDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const [streak, totalXP, weeklyXP, skillProgress] = await Promise.all([
    fetchUserStreak(userId),
    fetchTotalXP(userId),
    fetchWeeklyXP(userId),
    fetchUserSkillProgress(userId),
  ]);

  // Aggregate mastery across all active skills
  const activeProg = skillProgress.filter((p) => p.status === "active");
  const avgMastery =
    activeProg.length > 0
      ? activeProg.reduce((sum, p) => sum + p.mastery_pct, 0) / activeProg.length
      : 0;

  const totalConceptsMastered = skillProgress.reduce(
    (sum, p) => sum + p.concepts_mastered,
    0,
  );

  return {
    streak: streak?.current_streak ?? 0,
    streakFreezes: streak?.streak_freezes_available ?? 0,
    totalXP,
    weeklyXP,
    masteryPct: Math.round(avgMastery),
    masteryDelta: 0, // Would require historical data
    conceptsMastered: totalConceptsMastered,
    totalConcepts: 68, // Approximation; could sum from skills
  };
}

export async function fetchContinueLearning(
  userId: string,
  limit = 3,
): Promise<ContinueLearningItem[]> {
  // Get user's active skill progress, ordered by last practiced
  const { data: progress, error: progressError } = await supabase
    .from("user_skill_progress")
    .select(
      `*, skill:skills(id, name, slug, color_from, color_to, total_concepts)`,
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .order("last_practiced", { ascending: false })
    .limit(limit * 2);

  if (progressError) throw new Error(progressError.message);
  if (!progress?.length) return [];

  // For each skill, find next un-mastered concept
  const items: ContinueLearningItem[] = [];

  for (const prog of progress) {
    if (items.length >= limit) break;
    const skill = (prog as { skill: Record<string, unknown> }).skill as {
      id: string;
      name: string;
      slug: string;
      color_from: string | null;
      color_to: string | null;
      total_concepts: number;
    };
    if (!skill) continue;

    // Get next concept not yet mastered
    const { data: conceptMastery } = await supabase
      .from("user_concept_mastery")
      .select("concept_id, state, mastery_probability")
      .eq("user_id", userId)
      .in("state", ["learning", "unseen"])
      .order("mastery_probability", { ascending: true })
      .limit(1);

    const { data: concepts } = await supabase
      .from("concepts")
      .select("id, name, slug, sort_order")
      .eq("skill_id", skill.id)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(1);

    const nextConcept = concepts?.[0];
    if (!nextConcept) continue;

    const hasActivity = conceptMastery && conceptMastery.length > 0;

    items.push({
      skill_id: skill.id,
      skill_name: skill.name,
      skill_slug: skill.slug,
      concept_name: (nextConcept as { name: string }).name,
      concept_slug: (nextConcept as { slug: string }).slug,
      progress: prog.mastery_pct ?? 0,
      reason: hasActivity ? "Weakness detected" : "Continue learning",
      estimatedMinutes: 5 + Math.floor(Math.random() * 8),
      color_from: skill.color_from ?? "from-indigo-400/20",
      color_to: skill.color_to ?? "to-indigo-600/5",
    });
  }

  return items;
}

/* ────────────────────────────────────────────────────────────── */
/*  CONCEPT MASTERY                                                */
/* ────────────────────────────────────────────────────────────── */

export async function upsertConceptMastery(
  userId: string,
  conceptId: string,
  isCorrect: boolean,
): Promise<void> {
  // Fetch existing mastery
  const { data: existing } = await supabase
    .from("user_concept_mastery")
    .select("mastery_probability, times_seen, times_correct, state")
    .eq("user_id", userId)
    .eq("concept_id", conceptId)
    .maybeSingle();

  const prev = existing ?? { mastery_probability: 0, times_seen: 0, times_correct: 0, state: "unseen" };
  const timesCorrect = (prev.times_correct ?? 0) + (isCorrect ? 1 : 0);
  const timesSeen = (prev.times_seen ?? 0) + 1;

  // Simple mastery formula: clamp(old + ±0.08, 0, 1)
  const delta = isCorrect ? 0.08 : -0.05;
  const newMastery = Math.max(0, Math.min(1, (prev.mastery_probability ?? 0) + delta));

  const newState =
    newMastery >= 0.8 ? "mastered" : timesSeen > 0 ? "learning" : "unseen";

  // Next review (simple interval doubling)
  const reviewIntervalDays = newMastery >= 0.8 ? 7 : 1;
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + reviewIntervalDays);

  const { error } = await supabase.from("user_concept_mastery").upsert(
    {
      user_id: userId,
      concept_id: conceptId,
      mastery_probability: newMastery,
      actual_accuracy: timesSeen > 0 ? timesCorrect / timesSeen : 0,
      times_seen: timesSeen,
      times_correct: timesCorrect,
      state: newState,
      next_review_at: nextReview.toISOString(),
      review_interval_days: reviewIntervalDays,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,concept_id" },
  );

  if (error) throw new Error(error.message);
}

export async function updateSkillMasteryFromConcepts(
  userId: string,
  skillId: string,
): Promise<void> {
  // Count mastered concepts for this skill
  const { data: concepts } = await supabase
    .from("concepts")
    .select("id")
    .eq("skill_id", skillId)
    .eq("is_published", true);

  if (!concepts?.length) return;
  const conceptIds = concepts.map((c: { id: string }) => c.id);

  const { data: mastered } = await supabase
    .from("user_concept_mastery")
    .select("id")
    .eq("user_id", userId)
    .eq("state", "mastered")
    .in("concept_id", conceptIds);

  const masteredCount = mastered?.length ?? 0;
  const masteryPct =
    concepts.length > 0 ? (masteredCount / concepts.length) * 100 : 0;

  await supabase
    .from("user_skill_progress")
    .upsert(
      {
        user_id: userId,
        skill_id: skillId,
        mastery_pct: Math.round(masteryPct * 100) / 100,
        concepts_mastered: masteredCount,
        last_practiced: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,skill_id" },
    );
}

/* ────────────────────────────────────────────────────────────── */
/*  SKILL ENROLLMENTS (Migration 006)                              */
/* ────────────────────────────────────────────────────────────── */

export async function fetchUserEnrollments(
  userId: string,
): Promise<UserSkillEnrollment[]> {
  const { data, error } = await supabase
    .from("user_skill_enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  if (error) {
    // Table may not exist yet — return empty array gracefully
    console.warn("user_skill_enrollments table not found:", error.message);
    return [];
  }
  return (data as UserSkillEnrollment[]) ?? [];
}

export async function enrollInSkill(
  userId: string,
  skillId: string,
): Promise<void> {
  const { error } = await supabase
    .from("user_skill_enrollments")
    .upsert(
      { user_id: userId, skill_id: skillId, enrolled_at: new Date().toISOString() },
      { onConflict: "user_id,skill_id", ignoreDuplicates: true },
    );

  if (error) {
    console.warn("Could not enroll in skill:", error.message);
  }
}
