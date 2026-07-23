/* ============================================================
   src/hooks/useDashboard.ts
   TanStack Query hooks for dashboard stats and continue-learning.
   ============================================================ */

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchContinueLearning, fetchLeaderboard } from "../lib/api";
import { useAuth } from "../lib/auth";

/* ── Dashboard aggregate stats ── */
export function useDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard", "stats", user?.id],
    queryFn: () => fetchDashboardStats(user!.id),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 min
    refetchOnWindowFocus: true,
  });
}

/* ── Continue learning suggestions ── */
export function useContinueLearning(limit = 3) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard", "continue", user?.id, limit],
    queryFn: () => fetchContinueLearning(user!.id, limit),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/* ── Weekly leaderboard ── */
export function useLeaderboard(limit = 50) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: () => fetchLeaderboard(limit),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
