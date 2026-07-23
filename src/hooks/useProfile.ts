/* ============================================================
   src/hooks/useProfile.ts
   TanStack Query hooks for user profile, badges, and notification prefs.
   ============================================================ */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchNotificationPrefs,
  upsertNotificationPrefs,
  fetchUserBadges,
  fetchUserDailyGoals,
} from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Profile, UserNotificationPrefs } from "../lib/types";

/* ── User profile ── */
export function useUserProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchUserProfile(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/* ── Update profile mutation ── */
export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      updates: Partial<
        Pick<Profile, "display_name" | "bio" | "role" | "experience_band" | "profile_public" | "leaderboard_opt_in">
      >,
    ) => updateUserProfile(user!.id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}

/* ── Notification prefs ── */
export function useNotificationPrefs() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notification-prefs", user?.id],
    queryFn: () => fetchNotificationPrefs(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/* ── Update notification prefs mutation ── */
export function useUpdateNotificationPrefs() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      prefs: Partial<
        Omit<UserNotificationPrefs, "user_id" | "created_at" | "updated_at">
      >,
    ) => upsertNotificationPrefs(user!.id, prefs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notification-prefs", user?.id] });
    },
  });
}

/* ── User badges ── */
export function useUserBadges() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["badges", user?.id],
    queryFn: () => fetchUserBadges(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/* ── Daily goals ── */
export function useUserDailyGoals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["daily-goals", user?.id],
    queryFn: () => fetchUserDailyGoals(user!.id),
    enabled: !!user,
    staleTime: 60 * 1000, // 1 min
  });
}
