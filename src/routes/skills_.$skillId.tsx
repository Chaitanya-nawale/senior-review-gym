import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  GitBranch,
  Loader2,
  RotateCcw,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/skills_/$skillId")({
  component: SkillPracticePage,
});

/* ────────────────────────────────────────────────────────────── */
/*  HELPERS                                                        */
/* ────────────────────────────────────────────────────────────── */

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* Minimal syntax highlighter */
function highlight(code: string) {
  const KW =
    /\b(const|let|var|function|return|if|else|for|while|export|import|from|new|class|extends|await|async|try|catch|throw|CREATE|INDEX|ON|WHERE|IN|CONCURRENTLY|DESC)\b/g;
  const STR = /(["'`])(?:\\.|(?!\1).)*\1/g;
  const CMT = /(\/\/[^\n]*|--[^\n]*)/g;
  const NUM = /\b\d+\b/g;
  type Part = { t: string; c?: string };
  const parts: Part[] = [{ t: code }];
  const apply = (re: RegExp, cls: string) => {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].c) continue;
      const m = [...parts[i].t.matchAll(re)];
      if (!m.length) continue;
      const p = parts.splice(i, 1)[0];
      let last = 0;
      let added = 0;
      for (const match of m) {
        const index = match.index!;
        if (index > last) {
          parts.splice(i + added++, 0, { t: p.t.slice(last, index) });
        }
        parts.splice(i + added++, 0, { t: match[0], c: cls });
        last = index + match[0].length;
      }
      if (last < p.t.length) {
        parts.splice(i + added++, 0, { t: p.t.slice(last) });
      }
      i += added - 1;
    }
  };
  apply(CMT, "text-white/30 italic");
  apply(STR, "text-emerald-300/80");
  apply(KW, "text-indigo-400 font-semibold");
  apply(NUM, "text-fuchsia-300");

  return parts.map((p, i) =>
    p.c ? (
      <span key={i} className={p.c}>
        {p.t}
      </span>
    ) : (
      p.t
    ),
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                      */
/* ────────────────────────────────────────────────────────────── */

type ReviewCardType = {
  title: string;
  lang: string;
  code: string;
  bad: boolean;
  concept: string;
  why: string;
};

// Generic mock data fallback
const FALLBACK_CARDS: ReviewCardType[] = [
  {
    title: "Generic variable assignment",
    lang: "code",
    code: `let x = 10;\nx = "hello";`,
    bad: true,
    concept: "Type consistency",
    why: "Reassigning a variable with a different type can lead to runtime errors in strictly typed contexts.",
  },
  {
    title: "Simple loop optimization",
    lang: "code",
    code: `for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}`,
    bad: false,
    concept: "Basic iteration",
    why: "Standard iteration is perfectly acceptable here.",
  },
];

// Specific mock data for Python
const PYTHON_CARDS: ReviewCardType[] = [
  {
    title: "File handling without context manager",
    lang: "python",
    code: `f = open('data.txt', 'r')\ncontent = f.read()\n# Missing f.close()`,
    bad: true,
    concept: "Context Managers",
    why: "Always use the `with` statement for file handling to ensure files are closed properly even if an exception occurs.",
  },
  {
    title: "List comprehension",
    lang: "python",
    code: `squares = [x**2 for x in range(10) if x % 2 == 0]`,
    bad: false,
    concept: "List Comprehensions",
    why: "This is the Pythonic way to create lists. It's concise and generally faster than a standard for-loop.",
  },
];

// Combine mocked data keyed by skillId
const MOCK_SKILL_DATA: Record<string, ReviewCardType[]> = {
  python: PYTHON_CARDS,
};

/* ────────────────────────────────────────────────────────────── */
/*  COMPONENTS                                                     */
/* ────────────────────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
      <div className="flex items-center gap-2 text-[12px] text-white/50">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</div>
    </div>
  );
}

function KeyboardBridge({
  onResolve,
  active,
}: {
  onResolve: (d: "left" | "right") => void;
  active: boolean;
}) {
  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onResolve("left");
      if (e.key === "ArrowRight") onResolve("right");
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [onResolve, active]);
  return null;
}

function ReviewCard({
  card,
  approveOpacity,
  rejectOpacity,
}: {
  card: ReviewCardType;
  approveOpacity: any;
  rejectOpacity: any;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e12] to-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-white/50" />
          <span className="text-[12px] font-medium text-white/80">{card.title}</span>
        </div>
        <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-white/50">
          {card.lang}
        </span>
      </div>
      <pre className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-[1.7] text-white/85">
        <code>{highlight(card.code)}</code>
      </pre>
      <div className="border-t border-white/[0.06] bg-black/40 px-4 py-3 text-[11px] text-white/40">
        Concept · <span className="text-white/70">{card.concept}</span>
      </div>

      <motion.div
        style={{ opacity: approveOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-lg border-2 border-emerald-400 px-3 py-1 text-[13px] font-bold uppercase tracking-wider text-emerald-400"
      >
        Approve
      </motion.div>
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-lg border-2 border-rose-400 px-3 py-1 text-[13px] font-bold uppercase tracking-wider text-rose-400"
      >
        Reject
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                       */
/* ────────────────────────────────────────────────────────────── */

function SkillPracticePage() {
  const { skillId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Swiping State
  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    card: ReviewCardType;
  }>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [prevStreak, setPrevStreak] = useState(0);
  const [prevXp, setPrevXp] = useState(0);

  // Framer Motion Values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-200, -60, 0, 60, 200], [0.3, 1, 1, 1, 0.3]);
  const approveOpacity = useTransform(x, [20, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, -20], [1, 0]);

  // Derive cards to use
  const deck = MOCK_SKILL_DATA[skillId] || FALLBACK_CARDS;
  const card = deck[i % deck.length];

  const formattedSkillName = skillId
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  function resolve(dir: "left" | "right") {
    const userSaysBad = dir === "left";
    const correct = userSaysBad === card.bad;
    setPrevStreak(streak);
    setPrevXp(xp);
    setFeedback({ correct, card });
    if (correct) {
      setStreak((s) => s + 1);
      setXp((v) => v + 15);
    } else {
      setStreak(0);
    }
  }

  function nextCard() {
    setFeedback(null);
    setI((n) => n + 1);
    x.set(0);
  }

  function undo() {
    if (!feedback) return;
    setStreak(prevStreak);
    setXp(prevXp);
    setFeedback(null);
    x.set(0);
  }

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30">
      {/* Subtle Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500 opacity-[0.06] blur-[150px]"
      />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/skills"
              className="flex items-center gap-1.5 text-[13px] text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Skills Library
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/dashboard" className="text-[13px] text-white/50 transition hover:text-white">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            {formattedSkillName} Session
          </div>
        </div>
      </header>

      {/* Main Practice Area */}
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Info & Stats */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-indigo-300">
              Practice Mode
            </div>
            <h1 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              Code Review
              <br />
              <span className="text-white/40">Approve or Reject.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/60">
              You are reviewing snippets for <strong>{formattedSkillName}</strong>. Evaluate the
              code for potential bugs, anti-patterns, or security flaws. Swipe right if the code is
              solid, swipe left to reject it.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              <StatCard icon={Flame} label="Streak" value={streak} />
              <StatCard icon={Zap} label="Session XP" value={xp} />
              <StatCard icon={TrendingUp} label="Cards" value={i + (feedback ? 1 : 0)} />
            </div>

            <div className="mt-8 flex items-center gap-4 text-[12px] text-white/50">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                  ←
                </kbd>
                Reject
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                  →
                </kbd>
                Approve
              </span>
            </div>
          </div>

          {/* Right Column: Swiping Deck */}
          <div className="relative mx-auto h-[520px] w-full max-w-md">
            <AnimatePresence>
              {!feedback && (
                <motion.div
                  key={i}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -100) resolve("left");
                    else if (info.offset.x > 100) resolve("right");
                  }}
                  style={{ x, rotate, opacity }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <ReviewCard
                    card={card}
                    approveOpacity={approveOpacity}
                    rejectOpacity={rejectOpacity}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-xl backdrop-blur-sm"
                >
                  <div
                    className={cn(
                      "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      feedback.correct
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-rose-400/10 text-rose-300",
                    )}
                  >
                    {feedback.correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {feedback.correct ? "+15 XP" : "Missed"}
                  </div>
                  <div className="mt-4 text-[15px] font-semibold text-white">
                    {feedback.card.concept}
                  </div>
                  <p className="mt-2 flex-1 overflow-y-auto text-[14px] leading-relaxed text-white/65">
                    {feedback.card.why}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <button
                      onClick={undo}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Undo
                    </button>
                    <button
                      onClick={nextCard}
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-5 py-2 text-[13px] font-semibold text-white hover:bg-indigo-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    >
                      Next Card
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!feedback && (
              <div className="pointer-events-none absolute -bottom-6 left-1/2 flex w-full -translate-x-1/2 justify-center gap-2 text-[11px] text-white/30">
                <span>Drag horizontally to review</span>
              </div>
            )}
          </div>
        </div>
        <KeyboardBridge onResolve={resolve} active={!feedback} />
      </main>
    </div>
  );
}
