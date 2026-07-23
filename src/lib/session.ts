/* ============================================================
   src/lib/session.ts
   Session lifecycle management for the Skill Gym.
   Encapsulates: create → record card → award XP → complete.
   ============================================================ */

import {
  createSession,
  recordCardResult,
  completeSession,
  addXPEntry,
  updateStreakAfterSession,
  upsertConceptMastery,
  updateSkillMasteryFromConcepts,
  upsertUserSkillProgress,
} from "./api";
import type { Session, SessionType } from "./types";

const XP_PER_CORRECT = 15;
const XP_PER_SESSION_COMPLETE = 25;

/* ── Active session state ── */
export interface ActiveSession {
  session: Session;
  skillId: string;
  userId: string;
  startedAt: number; // Date.now()
  cardsAnswered: number;
  cardsCorrect: number;
  xpEarned: number;
  conceptsTouched: Set<string>; // concept IDs
}

/* ── Start a session ── */
export async function startGymSession(
  userId: string,
  skillId: string,
  type: SessionType = "practice",
): Promise<ActiveSession> {
  // Ensure skill progress row exists
  await upsertUserSkillProgress(userId, skillId);

  const session = await createSession(userId, skillId, type);

  return {
    session,
    skillId,
    userId,
    startedAt: Date.now(),
    cardsAnswered: 0,
    cardsCorrect: 0,
    xpEarned: 0,
    conceptsTouched: new Set(),
  };
}

/* ── Record one card answer ── */
export async function recordAnswer(
  active: ActiveSession,
  opts: {
    cardId: string;
    conceptId: string;
    isCorrect: boolean;
    answerIndex?: number;
    swipeDirection?: "left" | "right";
    userReasoning?: string;
    timeSpentMs?: number;
  },
): Promise<{ xpGained: number; newStreak: number }> {
  const xpGained = opts.isCorrect ? XP_PER_CORRECT : 0;

  // Write result row (fire-and-forget — don't await to keep UI responsive)
  recordCardResult({
    sessionId: active.session.id,
    userId: active.userId,
    cardId: opts.cardId,
    conceptId: opts.conceptId,
    isCorrect: opts.isCorrect,
    answerIndex: opts.answerIndex,
    swipeDirection: opts.swipeDirection,
    userReasoning: opts.userReasoning,
    timeSpentMs: opts.timeSpentMs,
    xpEarned: xpGained,
  }).catch(console.error);

  // Write XP ledger entry
  if (xpGained > 0) {
    addXPEntry({
      userId: active.userId,
      amount: xpGained,
      reason: "card_correct",
      sessionId: active.session.id,
      cardId: opts.cardId,
      skillId: active.skillId,
    }).catch(console.error);
  }

  // Update concept mastery
  upsertConceptMastery(active.userId, opts.conceptId, opts.isCorrect).catch(
    console.error,
  );

  // Update local counters
  active.cardsAnswered++;
  if (opts.isCorrect) active.cardsCorrect++;
  active.xpEarned += xpGained;
  active.conceptsTouched.add(opts.conceptId);

  const newStreak = opts.isCorrect ? active.cardsCorrect : 0;
  return { xpGained, newStreak };
}

/* ── Complete (end) a session ── */
export async function finishSession(active: ActiveSession): Promise<void> {
  const durationSeconds = Math.floor((Date.now() - active.startedAt) / 1000);

  // Session completion XP bonus
  if (active.cardsAnswered >= 3) {
    addXPEntry({
      userId: active.userId,
      amount: XP_PER_SESSION_COMPLETE,
      reason: "session_complete",
      sessionId: active.session.id,
      skillId: active.skillId,
    }).catch(console.error);
    active.xpEarned += XP_PER_SESSION_COMPLETE;
  }

  await Promise.allSettled([
    completeSession(active.session.id, {
      cardsSeen: active.cardsAnswered,
      cardsCorrect: active.cardsCorrect,
      xpEarned: active.xpEarned,
      conceptsPracticed: [...active.conceptsTouched],
      durationSeconds,
    }),
    updateStreakAfterSession(active.userId),
    updateSkillMasteryFromConcepts(active.userId, active.skillId),
  ]);
}
