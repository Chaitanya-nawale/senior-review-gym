import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Flame,
  GitBranch,
  Layers,
  Loader2,
  LogOut,
  Play,
  Settings,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MeisterUp" },
      {
        name: "description",
        content:
          "Your adaptive learning dashboard — track mastery, retention, and continue your personalized curriculum.",
      },
    ],
  }),
  component: DashboardPage,
});

/* ────────────────────────────────────────────────────────────── */
/*  HELPERS                                                        */
/* ────────────────────────────────────────────────────────────── */

function cn(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ────────────────────────────────────────────────────────────── */
/*  GREETING / HEADER                                              */
/* ────────────────────────────────────────────────────────────── */

function Greeting() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Developer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[32px]">
        {greeting}, {name}.
      </h1>
      <p className="mt-1.5 text-[15px] text-white/50">
        You've been on a 7-day streak. Keep building momentum.
      </p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  STAT CARDS ROW                                                 */
/* ────────────────────────────────────────────────────────────── */

function StatsRow() {
  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: "7",
      sub: "days",
      color: "text-amber-400",
    },
    {
      icon: Zap,
      label: "Total XP",
      value: "2,480",
      sub: "+145 this week",
      color: "text-indigo-400",
    },
    {
      icon: TrendingUp,
      label: "Mastery",
      value: "72%",
      sub: "+4% vs. last week",
      color: "text-emerald-400",
    },
    {
      icon: Target,
      label: "Concepts",
      value: "41 / 68",
      sub: "mastered",
      color: "text-fuchsia-400",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-white/40">
            <s.icon className={cn("h-3.5 w-3.5", s.color)} />
            {s.label}
          </div>
          <div className="mt-2 font-mono text-[24px] font-semibold tabular-nums text-white">
            {s.value}
          </div>
          <div className="mt-0.5 text-[12px] text-white/40">{s.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  CONTINUE LEARNING / RECOMMENDED                                */
/* ────────────────────────────────────────────────────────────── */

const CONTINUE_CARDS = [
  {
    skill: "Python",
    concept: "Context Managers",
    reason: "Prereq mastered",
    est: "5 min",
    progress: 72,
    tone: "from-yellow-400/20 to-yellow-600/5",
    icon: Terminal,
  },
  {
    skill: "TypeScript",
    concept: "Discriminated Unions",
    reason: "Weakness detected",
    est: "8 min",
    progress: 38,
    tone: "from-blue-400/20 to-blue-600/5",
    icon: Cpu,
  },
  {
    skill: "System Design",
    concept: "Rate Limiting Strategies",
    reason: "New concept unlocked",
    est: "12 min",
    progress: 0,
    tone: "from-fuchsia-400/20 to-fuchsia-600/5",
    icon: Layers,
  },
];

function ContinueLearning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-white">Continue learning</h2>
        <Link
          to="/skills"
          className="flex items-center gap-1 text-[13px] text-white/50 transition hover:text-white"
        >
          View all skills <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {CONTINUE_CARDS.map((c) => (
          <div
            key={c.concept}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20"
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                c.tone,
              )}
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <c.icon className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/40">{c.skill}</div>
                    <div className="text-[14px] font-semibold text-white">{c.concept}</div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/20 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60" />
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-white/50">
                <span className="flex items-center gap-1">
                  <Brain className="h-3 w-3" /> {c.reason}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" /> {c.est}
                </span>
              </div>

              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MASTERY CHART                                                  */
/* ────────────────────────────────────────────────────────────── */

function MasteryChart() {
  const pts = useMemo(() => {
    const arr: number[] = [];
    let v = 22;
    for (let i = 0; i < 30; i++) {
      v += Math.random() * 4 - 0.5;
      v = Math.max(20, Math.min(80, v));
      arr.push(v);
    }
    return arr;
  }, []);
  const w = 600;
  const h = 160;
  const path = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((v - 20) / 60) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const fill = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-40 w-full">
      <defs>
        <linearGradient id="dashFillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          x2={w}
          y1={(h / 3) * i}
          y2={(h / 3) * i}
          stroke="#ffffff"
          strokeOpacity="0.05"
        />
      ))}
      <motion.path
        d={fill}
        fill="url(#dashFillGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  HEATMAP                                                        */
/* ────────────────────────────────────────────────────────────── */

function Heatmap() {
  const cells = useMemo(() => {
    return Array.from({ length: 7 * 20 }, () => Math.random());
  }, []);
  const colorFor = (v: number) => {
    if (v < 0.2) return "bg-white/[0.04]";
    if (v < 0.4) return "bg-rose-500/60";
    if (v < 0.55) return "bg-amber-400/60";
    if (v < 0.7) return "bg-yellow-300/60";
    if (v < 0.85) return "bg-lime-400/70";
    return "bg-emerald-400/80";
  };
  return (
    <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: "repeat(20, minmax(0,1fr))" }}>
      {cells.map((v, i) => (
        <div key={i} className={cn("aspect-square rounded-sm", colorFor(v))} />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  PROGRESS PANEL (chart + heatmap + sidebar)                     */
/* ────────────────────────────────────────────────────────────── */

function ProgressPanel() {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "All">("30d");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <h2 className="text-[18px] font-semibold text-white">Your progress</h2>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-black">
        <div className="grid gap-0 lg:grid-cols-12">
          {/* Left — chart */}
          <div className="border-b border-white/[0.06] p-5 lg:col-span-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
                Mastery over time
              </div>
              <div className="flex gap-1 text-[10px] text-white/40">
                {(["30d", "90d", "All"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={cn(
                      "rounded px-1.5 py-0.5 transition",
                      timeRange === t ? "bg-white/[0.08] text-white/70" : "hover:text-white/60",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <MasteryChart />
          </div>

          {/* Right — key metrics */}
          <div className="p-5 lg:col-span-4">
            <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              Current skill — Python
            </div>
            <div className="mt-4 space-y-4">
              {[
                { label: "Overall mastery", value: "72%" },
                { label: "Concepts mastered", value: "41 / 68" },
                { label: "Retention (7-day)", value: "94%" },
                {
                  label: "Learning velocity",
                  value: "+12% wk",
                  tone: "emerald" as const,
                },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-[11px] text-white/50">{m.label}</div>
                  <div
                    className={cn(
                      "mt-0.5 font-mono text-[18px] font-semibold tabular-nums",
                      m.tone === "emerald" ? "text-emerald-300" : "text-white",
                    )}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="border-t border-white/[0.06] p-5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              Concept heatmap
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span>Weak</span>
              <div className="flex gap-0.5">
                {[
                  "bg-rose-500/70",
                  "bg-amber-400/70",
                  "bg-yellow-300/70",
                  "bg-lime-400/70",
                  "bg-emerald-400/80",
                ].map((c) => (
                  <div key={c} className={cn("h-2 w-4 rounded-sm", c)} />
                ))}
              </div>
              <span>Mastered</span>
            </div>
          </div>
          <Heatmap />
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  RECENT ACTIVITY                                                */
/* ────────────────────────────────────────────────────────────── */

const RECENT_ACTIVITY = [
  {
    type: "Code Review",
    concept: "JWT Verification",
    result: "correct",
    xp: 25,
    time: "12 min ago",
    icon: GitBranch,
  },
  {
    type: "Explain-back",
    concept: "Stable Callbacks",
    result: "correct",
    xp: 30,
    time: "34 min ago",
    icon: Sparkles,
  },
  {
    type: "Scenario Decision",
    concept: "Connection Pooling",
    result: "incorrect",
    xp: 0,
    time: "1h ago",
    icon: Cpu,
    explanation:
      "You chose 'Increase max connections to 5000' but the database instance only has 4GB RAM. This would lead to OOM errors. The correct approach was 'Implement application-side pooling with PgBouncer'.",
  },
  {
    type: "Ordering",
    concept: "HTTP Lifecycle",
    result: "correct",
    xp: 20,
    time: "1h ago",
    icon: Layers,
  },
  {
    type: "Simulation",
    concept: "Async Generators",
    result: "correct",
    xp: 35,
    time: "2h ago",
    icon: Terminal,
  },
];

function RecentActivity() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-white">Recent activity</h2>
        <a href="#" className="text-[13px] text-white/50 transition hover:text-white">
          View all
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        {RECENT_ACTIVITY.map((a, i) => (
          <Fragment key={i}>
            <div
              className={cn(
                "flex items-center justify-between px-5 py-3.5 transition hover:bg-white/[0.02]",
                i !== RECENT_ACTIVITY.length - 1 && "border-b border-white/[0.06]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <a.icon className="h-4 w-4 text-white/60" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white">{a.concept}</div>
                  <div className="text-[11px] text-white/40">{a.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    a.result === "correct"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-rose-400/10 text-rose-300",
                  )}
                >
                  {a.result === "correct" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-[10px]">✗</span>
                  )}
                  {a.result === "correct" ? "Correct" : "Missed"}
                </div>
                {a.xp > 0 && (
                  <span className="font-mono text-[12px] text-indigo-300">+{a.xp} XP</span>
                )}
                {a.result === "incorrect" && (
                  <button
                    onClick={() => setExpandedId(expandedId === i ? null : i)}
                    className="hidden text-[11px] font-medium text-indigo-400 transition hover:text-indigo-300 sm:block"
                  >
                    Review
                  </button>
                )}
                <span className="hidden text-[11px] text-white/30 sm:block">{a.time}</span>
              </div>
            </div>
            <AnimatePresence>
              {expandedId === i && a.explanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-rose-400/[0.02]"
                >
                  <div className="border-t border-rose-400/10 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Brain className="mt-0.5 h-4 w-4 text-rose-400/70" />
                      <div>
                        <div className="text-[12px] font-medium text-rose-300">
                          Why did I get this wrong?
                        </div>
                        <div className="mt-1 text-[13px] leading-relaxed text-white/70">
                          {a.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  QUICK ACTIONS SIDEBAR                                          */
/* ────────────────────────────────────────────────────────────── */

function QuickActions() {
  const actions = [
    {
      icon: Play,
      label: "Start a session",
      desc: "Continue where you left off",
      primary: true,
    },
    {
      icon: BookOpen,
      label: "Browse skills",
      desc: "Explore 20+ skill trees",
      primary: false,
    },
    {
      icon: Brain,
      label: "Re-assess",
      desc: "Retake the adaptive assessment",
      primary: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-3"
    >
      <h3 className="text-[14px] font-semibold text-white">Quick actions</h3>
      {actions.map((a) =>
        a.label === "Browse skills" ? (
          <Link
            key={a.label}
            to="/skills"
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
              "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
            )}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60">
              <a.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">{a.label}</div>
              <div className="text-[11px] text-white/40">{a.desc}</div>
            </div>
          </Link>
        ) : (
          <button
            key={a.label}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
              a.primary
                ? "border-indigo-400/30 bg-indigo-400/[0.06] hover:bg-indigo-400/[0.12]"
                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border",
                a.primary
                  ? "border-indigo-400/30 bg-indigo-400/10 text-indigo-300"
                  : "border-white/10 bg-white/[0.04] text-white/60",
              )}
            >
              <a.icon className="h-4 w-4" />
            </div>
            <div>
              <div
                className={cn(
                  "text-[13px] font-semibold",
                  a.primary ? "text-indigo-200" : "text-white",
                )}
              >
                {a.label}
              </div>
              <div className="text-[11px] text-white/40">{a.desc}</div>
            </div>
          </button>
        ),
      )}

      {/* Daily goals */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="text-[12px] font-medium uppercase tracking-widest text-white/40">
          Daily goals
        </h3>
        <div className="mt-3 space-y-3">
          {[
            { label: "Complete 3 activities", done: 2, total: 3 },
            { label: "Earn 50 XP", done: 45, total: 50 },
            { label: "Master 1 concept", done: 1, total: 1 },
          ].map((g) => (
            <div key={g.label}>
              <div className="flex items-center justify-between text-[12px]">
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    g.done >= g.total ? "text-emerald-300" : "text-white/60",
                  )}
                >
                  {g.done >= g.total && <Check className="h-3 w-3" />}
                  {g.label}
                </span>
                <span className="font-mono text-white/40">
                  {g.done}/{g.total}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    g.done >= g.total
                      ? "bg-emerald-400"
                      : "bg-gradient-to-r from-indigo-400 to-fuchsia-400",
                  )}
                  style={{
                    width: `${Math.min(100, (g.done / g.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                      */
/* ────────────────────────────────────────────────────────────── */

function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-black font-sans">
      <main className="mx-auto max-w-7xl px-6 pt-10 pb-20">
        <Greeting />

        <div className="mt-8">
          <StatsRow />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="space-y-10">
            <ContinueLearning />
            <ProgressPanel />
            <RecentActivity />
          </div>
          <div className="hidden lg:block">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
