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
} from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/skills")({
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
/*  HELPERS                                                        */
/* ────────────────────────────────────────────────────────────── */

function cn(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ────────────────────────────────────────────────────────────── */
/*  DATA                                                           */
/* ────────────────────────────────────────────────────────────── */

type SkillStatus = "active" | "completed" | "locked" | "new";

interface Skill {
  name: string;
  category: string;
  learners: string;
  tone: string;
  icon: React.ElementType;
  mastery: number;
  concepts: number;
  totalConcepts: number;
  xp: number;
  status: SkillStatus;
  streak?: number;
  estimatedHours: number;
}

const SKILLS: Skill[] = [
  {
    name: "Python",
    category: "Languages",
    learners: "48k",
    tone: "from-yellow-400/25 to-yellow-600/5",
    icon: Terminal,
    mastery: 72,
    concepts: 41,
    totalConcepts: 68,
    xp: 1840,
    status: "active",
    streak: 7,
    estimatedHours: 12,
  },
  {
    name: "TypeScript",
    category: "Languages",
    learners: "61k",
    tone: "from-blue-400/25 to-blue-600/5",
    icon: Cpu,
    mastery: 38,
    concepts: 24,
    totalConcepts: 71,
    xp: 640,
    status: "active",
    estimatedHours: 22,
  },
  {
    name: "System Design",
    category: "Architecture",
    learners: "29k",
    tone: "from-fuchsia-400/25 to-fuchsia-600/5",
    icon: Layers,
    mastery: 0,
    concepts: 0,
    totalConcepts: 55,
    xp: 0,
    status: "new",
    estimatedHours: 30,
  },
  {
    name: "React",
    category: "Frameworks",
    learners: "54k",
    tone: "from-sky-400/25 to-sky-600/5",
    icon: Zap,
    mastery: 61,
    concepts: 33,
    totalConcepts: 59,
    xp: 1240,
    status: "active",
    estimatedHours: 15,
  },
  {
    name: "SQL",
    category: "Databases",
    learners: "37k",
    tone: "from-indigo-400/25 to-indigo-600/5",
    icon: BookOpen,
    mastery: 85,
    concepts: 47,
    totalConcepts: 52,
    xp: 2100,
    status: "completed",
    estimatedHours: 5,
  },
  {
    name: "Rust",
    category: "Languages",
    learners: "12k",
    tone: "from-orange-400/25 to-orange-600/5",
    icon: Flame,
    mastery: 0,
    concepts: 0,
    totalConcepts: 80,
    xp: 0,
    status: "locked",
    estimatedHours: 45,
  },
  {
    name: "Go",
    category: "Languages",
    learners: "19k",
    tone: "from-cyan-300/25 to-cyan-500/5",
    icon: Play,
    mastery: 0,
    concepts: 0,
    totalConcepts: 64,
    xp: 0,
    status: "new",
    estimatedHours: 28,
  },
  {
    name: "Machine Learning",
    category: "AI & ML",
    learners: "27k",
    tone: "from-emerald-400/25 to-emerald-600/5",
    icon: Brain,
    mastery: 0,
    concepts: 0,
    totalConcepts: 90,
    xp: 0,
    status: "locked",
    estimatedHours: 60,
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    learners: "16k",
    tone: "from-blue-300/25 to-blue-500/5",
    icon: Layers,
    mastery: 0,
    concepts: 0,
    totalConcepts: 58,
    xp: 0,
    status: "new",
    estimatedHours: 35,
  },
  {
    name: "Docker",
    category: "DevOps",
    learners: "22k",
    tone: "from-sky-300/25 to-sky-500/5",
    icon: Cpu,
    mastery: 52,
    concepts: 22,
    totalConcepts: 44,
    xp: 780,
    status: "active",
    estimatedHours: 10,
  },
  {
    name: "AWS",
    category: "Cloud",
    learners: "31k",
    tone: "from-amber-400/25 to-amber-600/5",
    icon: Zap,
    mastery: 0,
    concepts: 0,
    totalConcepts: 95,
    xp: 0,
    status: "new",
    estimatedHours: 50,
  },
  {
    name: "Prompt Engineering",
    category: "AI & ML",
    learners: "44k",
    tone: "from-violet-400/25 to-violet-600/5",
    icon: Sparkles,
    mastery: 88,
    concepts: 29,
    totalConcepts: 33,
    xp: 1680,
    status: "completed",
    estimatedHours: 3,
  },
  {
    name: "Git",
    category: "Tools",
    learners: "39k",
    tone: "from-red-400/25 to-red-600/5",
    icon: GitBranch,
    mastery: 90,
    concepts: 38,
    totalConcepts: 42,
    xp: 1920,
    status: "completed",
    estimatedHours: 2,
  },
  {
    name: "Data Structures",
    category: "CS Fundamentals",
    learners: "42k",
    tone: "from-pink-400/25 to-pink-600/5",
    icon: TrendingUp,
    mastery: 45,
    concepts: 21,
    totalConcepts: 48,
    xp: 820,
    status: "active",
    estimatedHours: 18,
  },
  {
    name: "Cybersecurity",
    category: "Security",
    learners: "18k",
    tone: "from-rose-400/25 to-rose-600/5",
    icon: Lock,
    mastery: 0,
    concepts: 0,
    totalConcepts: 76,
    xp: 0,
    status: "locked",
    estimatedHours: 40,
  },
  {
    name: "AI Engineering",
    category: "AI & ML",
    learners: "33k",
    tone: "from-purple-400/25 to-purple-600/5",
    icon: Brain,
    mastery: 0,
    concepts: 0,
    totalConcepts: 62,
    xp: 0,
    status: "new",
    estimatedHours: 32,
  },
  {
    name: "Linux",
    category: "Tools",
    learners: "24k",
    tone: "from-zinc-300/25 to-zinc-500/5",
    icon: Terminal,
    mastery: 70,
    concepts: 35,
    totalConcepts: 50,
    xp: 1360,
    status: "active",
    estimatedHours: 8,
  },
  {
    name: "DevOps",
    category: "DevOps",
    learners: "21k",
    tone: "from-lime-400/25 to-lime-600/5",
    icon: GitBranch,
    mastery: 0,
    concepts: 0,
    totalConcepts: 72,
    xp: 0,
    status: "new",
    estimatedHours: 38,
  },
  {
    name: "Networking",
    category: "CS Fundamentals",
    learners: "14k",
    tone: "from-teal-400/25 to-teal-600/5",
    icon: Layers,
    mastery: 0,
    concepts: 0,
    totalConcepts: 54,
    xp: 0,
    status: "locked",
    estimatedHours: 25,
  },
  {
    name: "Statistics",
    category: "CS Fundamentals",
    learners: "11k",
    tone: "from-green-400/25 to-green-600/5",
    icon: TrendingUp,
    mastery: 0,
    concepts: 0,
    totalConcepts: 46,
    xp: 0,
    status: "locked",
    estimatedHours: 20,
  },
];

const CATEGORIES = [
  "All",
  "Languages",
  "Frameworks",
  "Architecture",
  "Databases",
  "DevOps",
  "Cloud",
  "AI & ML",
  "Security",
  "Tools",
  "CS Fundamentals",
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

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const navigate = useNavigate();
  const isLocked = skill.status === "locked";
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
        if (!isLocked) {
          navigate({
            to: "/skills/$skillId",
            params: { skillId: skill.name.toLowerCase().replace(/\s+/g, "-") },
          });
        }
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
            {skill.streak && skill.streak > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-amber-400">
                <Flame className="h-3 w-3" />
                {skill.streak}d streak
              </div>
            )}
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

function StatBar({ skills }: { skills: Skill[] }) {
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
/*  NAV                                                            */
/* ────────────────────────────────────────────────────────────── */

function SkillsNav() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Developer";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-[13px] text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Link to="/" className="group flex items-center gap-2">
            <img src="/favicon.ico" alt="MeisterUp Logo" className="h-5 w-5 object-contain" />
            <span className="text-[14px] font-semibold tracking-tight text-white">MeisterUp</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[13px] text-white/60 md:flex">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span>Skills Library</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-[11px] font-bold text-white uppercase">
            {initial}
          </div>
        </div>
      </div>
    </header>
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
    "all" | "active" | "new" | "completed" | "locked"
  >("all");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  const filteredSkills = useMemo(() => {
    return SKILLS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesStatus = activeFilter === "all" || s.status === activeFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, activeCategory, activeFilter]);

  if (loading) {
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
    { key: "locked", label: "Locked" },
  ];

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500 opacity-[0.08] blur-[120px]"
      />

      <SkillsNav />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-24">
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
          <StatBar skills={SKILLS} />
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
          {CATEGORIES.map((cat) => (
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
                <SkillCard key={skill.name} skill={skill} index={i} />
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
