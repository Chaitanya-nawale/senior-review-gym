import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Clock,
  Cpu,
  Flame,
  GitBranch,
  Layers,
  Loader2,
  Lock,
  Play,
  Search,
  Sparkles,
  Star,
  Terminal,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { cn } from "../lib/utils";
import { usePublishedSkills } from "../hooks/useSkills";
import { useUserSkillProgress } from "../hooks/useSkills";
import type { Skill as DBSkill, UserSkillProgress } from "../lib/types";

export const Route = createFileRoute("/_authenticated/skills")({
  head: () => ({
    meta: [
      { title: "Skills — MeisterUp" },
      {
        name: "description",
        content:
          "Browse your personalized skill library — track mastery, explore new skills, and continue your adaptive learning journey.",
      },
    ],
  }),
  component: SkillsPage,
});

/* ────────────────────────────────────────────────────────────── */
/*  TYPES (view-model, not DB types)                               */
/* ────────────────────────────────────────────────────────────── */

type SkillStatus = "active" | "completed" | "locked" | "new";

interface SkillViewModel {
  id: string;
  name: string;
  slug: string;
  category: string;
  learners: string;
  tone: string;
  icon: LucideIcon;
  mastery: number;
  concepts: number;
  totalConcepts: number;
  xp: number;
  status: SkillStatus;
  estimatedHours: number;
}

/* ── Icon name → Lucide component ── */
const ICON_MAP: Record<string, LucideIcon> = {
  Terminal,
  Cpu,
  Layers,
  Zap,
  GitBranch,
  Brain,
  Sparkles,
  Lock,
  BookOpen,
  TrendingUp,
  Play,
  Star,
};

function resolveIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Terminal;
  return ICON_MAP[iconName] ?? Terminal;
}

/* ── Merge DB skill + user progress into a view-model ── */
function toViewModel(
  skill: DBSkill,
  progress: UserSkillProgress | undefined,
): SkillViewModel {
  const mastery = progress ? Math.round(progress.mastery_pct) : 0;
  const status: SkillStatus = progress
    ? mastery >= 80
      ? "completed"
      : "active"
    : "new";

  const learners =
    skill.learner_count >= 1000
      ? `${Math.round(skill.learner_count / 1000)}k`
      : String(skill.learner_count);

  return {
    id: skill.id,
    name: skill.name,
    slug: skill.slug,
    category: skill.category,
    learners,
    tone: `${skill.color_from ?? "from-indigo-400/20"} ${skill.color_to ?? "to-indigo-600/5"}`,
    icon: resolveIcon(skill.icon_name),
    mastery,
    concepts: progress?.concepts_mastered ?? 0,
    totalConcepts: skill.total_concepts,
    xp: progress?.total_xp ?? 0,
    status,
    estimatedHours: skill.estimated_hours ?? 0,
  };
}

const CATEGORIES = [

  "All",
  "Languages",
  "Frameworks",
  "Architecture",
  "Infrastructure",
  "Cloud",
  "AI",
  "Security",
  "Tools",
  "Data",
  "Foundations",
];

/* ────────────────────────────────────────────────────────────── */
/*  STATUS BADGE                                                    */
/* ────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: SkillStatus }) {
  const map: Record<SkillStatus, { label: string; classes: string }> = {
    active: {
      label: "In Progress",
      classes: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
    },
    completed: {
      label: "Completed",
      classes: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    },
    new: {
      label: "New",
      classes: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    },
    locked: {
      label: "Locked",
      classes: "border-white/10 bg-white/[0.03] text-white/30",
    },
  };
  const { label, classes } = map[status];
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        classes,
      )}
    >
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  SKILL CARD                                                      */
/* ────────────────────────────────────────────────────────────── */

function SkillCard({ skill, index }: { skill: SkillViewModel; index: number }) {
  const navigate = useNavigate();
  const isLocked = false; // DB skills are never locked; all are browsable
  const isCompleted = skill.status === "completed";
  const hasProgress = skill.mastery > 0;

  const masteryColor = isCompleted
    ? "from-emerald-400 to-teal-400"
    : "from-indigo-400 to-fuchsia-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 12) * 0.04, duration: 0.45 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/[0.02] transition-all duration-300",
        isLocked
          ? "border-white/[0.06] opacity-60"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer",
      )}
      onClick={() => {
        navigate({
          to: "/skills/$skillId",
          params: { skillId: skill.slug },
        });
      }}
    >
      {/* Gradient overlay on hover */}
      {!isLocked && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            skill.tone,
          )}
        />
      )}

      <div className="relative p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border",
                isLocked
                  ? "border-white/[0.06] bg-white/[0.02] text-white/20"
                  : "border-white/10 bg-white/[0.04] text-white/70 group-hover:text-white",
              )}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <skill.icon className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-white">{skill.name}</div>
              <div className="text-[11px] text-white/40">
                {skill.category} · {skill.learners} learners
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={skill.status} />
          </div>
        </div>

        {/* Mastery bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/40">
              {hasProgress
                ? `${skill.concepts} / ${skill.totalConcepts} concepts`
                : `${skill.totalConcepts} concepts`}
            </span>
            <span
              className={cn(
                "font-semibold",
                isCompleted ? "text-emerald-400" : hasProgress ? "text-white/70" : "text-white/30",
              )}
            >
              {isLocked ? "—" : `${skill.mastery}%`}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            {!isLocked && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.mastery}%` }}
                transition={{ delay: 0.3 + (index % 12) * 0.04, duration: 0.8 }}
                className={cn("h-full rounded-full bg-gradient-to-r", masteryColor)}
              />
            )}
          </div>
        </div>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-white/40">
            {skill.xp > 0 && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-indigo-400" />
                {skill.xp.toLocaleString()} XP
              </span>
            )}
            {!isCompleted && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />~{skill.estimatedHours}h left
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-400/70">
                <Check className="h-3 w-3" />
                Mastered
              </span>
            )}
          </div>
          {!isLocked && (
            <div className="flex items-center gap-1 text-[11px] text-white/30 transition-colors group-hover:text-white/60">
              {skill.status === "active" || skill.status === "completed" ? (
                <>
                  Continue
                  <ChevronRight className="h-3 w-3" />
                </>
              ) : (
                <>
                  Start
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </div>
          )}
          {isLocked && (
            <div className="flex items-center gap-1 text-[11px] text-white/20">
              <Lock className="h-3 w-3" />
              Unlock first
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  STAT SUMMARY BAR                                               */
/* ────────────────────────────────────────────────────────────── */

function StatBar({ skills }: { skills: SkillViewModel[] }) {
  const active = skills.filter((s) => s.status === "active").length;
  const completed = skills.filter((s) => s.status === "completed").length;
  const totalXP = skills.reduce((acc, s) => acc + s.xp, 0);
  const avgMastery =
    skills.filter((s) => s.mastery > 0).length > 0
      ? Math.round(
          skills.filter((s) => s.mastery > 0).reduce((a, s) => a + s.mastery, 0) /
            skills.filter((s) => s.mastery > 0).length,
        )
      : 0;

  const stats = [
    { icon: TrendingUp, label: "Active skills", value: `${active}`, color: "text-indigo-400" },
    { icon: Check, label: "Completed", value: `${completed}`, color: "text-emerald-400" },
    { icon: Zap, label: "Total XP", value: totalXP.toLocaleString(), color: "text-amber-400" },
    { icon: Brain, label: "Avg mastery", value: `${avgMastery}%`, color: "text-fuchsia-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <s.icon className={cn("h-4 w-4", s.color)} />
            <span className="text-[11px] text-white/40">{s.label}</span>
          </div>
          <div className="mt-1.5 text-[22px] font-semibold tracking-tight text-white">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                       */
/* ────────────────────────────────────────────────────────────── */

function SkillsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "new" | "completed"
  >("all");

  // Real data hooks
  const { data: rawSkills, isLoading: skillsLoading } = usePublishedSkills();
  const { data: progressList } = useUserSkillProgress();

  // Build progress lookup: skill_id -> UserSkillProgress
  const progressMap = useMemo(() => {
    const m = new Map<string, UserSkillProgress>();
    (progressList ?? []).forEach((p) => m.set(p.skill_id, p));
    return m;
  }, [progressList]);

  // Merge skills + progress into view models
  const allSkills = useMemo<SkillViewModel[]>(() => {
    return (rawSkills ?? []).map((s) => toViewModel(s, progressMap.get(s.id)));
  }, [rawSkills, progressMap]);

  // Categories derived from actual DB data
  const categories = useMemo(() => {
    const cats = new Set(allSkills.map((s) => s.category));
    return ["All", ...Array.from(cats).sort()];
  }, [allSkills]);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  const filteredSkills = useMemo<SkillViewModel[]>(() => {
    return allSkills.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesStatus = activeFilter === "all" || s.status === activeFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allSkills, search, activeCategory, activeFilter]);

  if (loading || skillsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const statusFilters: { key: typeof activeFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "In Progress" },
    { key: "new", label: "New" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500 opacity-[0.08] blur-[120px]"
      />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            <span>Skill Library</span>
          </div>
          <h1 className="mt-4 text-[32px] font-semibold tracking-[-0.03em] text-white sm:text-[40px]">
            Your skills
          </h1>
          <p className="mt-2 text-[15px] text-white/50">
            Browse all available learning paths, track your mastery, and pick up where you left off.
          </p>
        </motion.div>

        {/* Stat summary row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StatBar skills={allSkills} />
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="skills-search"
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-white/30 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-indigo-500/25"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                id={`filter-${f.key}`}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition",
                  activeFilter === f.key
                    ? "border-indigo-400/30 bg-indigo-400/10 text-indigo-300"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category filter strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-${cat.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium transition",
                activeCategory === cat
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/60",
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid of skills */}
        <AnimatePresence mode="popLayout">
          {filteredSkills.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map((skill, i) => (
                <SkillCard key={skill.id} skill={skill} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-24 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <Search className="h-6 w-6 text-white/30" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-white/60">No skills found</p>
                <p className="mt-1 text-[13px] text-white/30">
                  Try a different search term or category filter.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setActiveFilter("all");
                }}
                className="mt-2 text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
