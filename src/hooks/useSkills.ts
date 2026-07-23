/* ============================================================
   src/hooks/useSkills.ts
   TanStack Query hooks for skills and user skill progress.
   ============================================================ */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPublishedSkills,
  fetchSkillBySlug,
  fetchUserSkillProgress,
  upsertUserSkillProgress,
  enrollInSkill,
  fetchUserEnrollments,
} from "../lib/api";
import { useAuth } from "../lib/auth";

/* ── All published skills ── */
export function usePublishedSkills() {
  return useQuery({
    queryKey: ["skills", "published"],
    queryFn: fetchPublishedSkills,
    staleTime: 10 * 60 * 1000, // 10 min — skills don't change often
  });
}

/* ── Single skill by slug ── */
export function useSkillBySlug(slug: string) {
  return useQuery({
    queryKey: ["skills", "slug", slug],
    queryFn: () => fetchSkillBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/* ── User's progress across all skills ── */
export function useUserSkillProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["skills", "progress", user?.id],
    queryFn: () => fetchUserSkillProgress(user!.id),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 min
  });
}

/* ── User enrollments (migration 006) ── */
export function useUserEnrollments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: () => fetchUserEnrollments(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/* ── Enroll in a skill mutation ── */
export function useEnrollInSkill() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) => enrollInSkill(user!.id, skillId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments", user?.id] });
      qc.invalidateQueries({ queryKey: ["skills", "progress", user?.id] });
    },
  });
}

/* ── Upsert user skill progress ── */
export function useStartSkill() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) =>
      upsertUserSkillProgress(user!.id, skillId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["skills", "progress", user?.id] });
    },
  });
}
