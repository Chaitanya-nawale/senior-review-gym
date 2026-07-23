/* ============================================================
   src/hooks/useStreak.ts
   TanStack Query hook for user streaks and gamification data.
   ============================================================ */

import { useQuery } from "@tanstack/react-query";
import { fetchUserStreak } from "../lib/api";
import { useAuth } from "../lib/auth";

/* ── User streak ── */
export function useStreak() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["streak", user?.id],
    queryFn: () => fetchUserStreak(user!.id),
    enabled: !!user,
    staleTime: 60 * 1000, // 1 min — refresh often for realtime feel
    refetchOnWindowFocus: true,
  });
}
