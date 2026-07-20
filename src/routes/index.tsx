import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../lib/auth";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Command,
  Cpu,
  Flame,
  GitBranch,
  Github,
  Layers,
  LineChart,
  Lock,
  Network,
  Play,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  RotateCcw,
  Twitter,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeisterUp — Adaptive Learning Platform for Engineers" },
      {
        name: "description",
        content:
          "An AI-native adaptive learning platform that models what you already know, finds your gaps, and teaches the right concept next, for any technical skill.",
      },
      { property: "og:title", content: "MeisterUp — Adaptive Learning Platform for Engineers" },
      {
        property: "og:description",
        content:
          "An AI-native adaptive learning platform that models what you already know, finds your gaps, and teaches the right concept next, for any technical skill.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

/* ────────────────────────────────────────────────────────────── */
/*  PRIMITIVES                                                    */
/* ────────────────────────────────────────────────────────────── */

function cn(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 backdrop-blur">
      {children}
    </div>
  );
}

function GridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
      }}
    />
  );
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-[120px] opacity-40", className)}
    />
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  NAV                                                           */
/* ────────────────────────────────────────────────────────────── */

function Nav() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-black/60 border-b border-white/[0.06]" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="group flex items-center gap-2">
          <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight text-white">MeisterUp</span>
          <span className="ml-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white/50">
            Beta
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            ["Platform", "#platform"],
            ["Curriculum", "#curriculum"],
            ["Skills", "#skills"],
            ["Pricing", "#pricing"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-white/90"
            >
              Go to Dashboard
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                className="hidden text-[13px] font-medium text-white/70 hover:text-white sm:block"
              >
                Sign in
              </Link>
              <a
                href="#demo"
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-white/90"
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  HERO                                                          */
/* ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24">
      <GridBg />
      <GlowOrb className="left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 bg-indigo-500" />
      <GlowOrb className="right-0 top-40 h-[380px] w-[380px] bg-fuchsia-500/40" />
      <GlowOrb className="left-0 top-60 h-[380px] w-[380px] bg-cyan-500/40" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <Eyebrow>
            <Sparkles className="h-3 w-3" />
            <span>Adaptive engine · v1.4</span>
          </Eyebrow>

          <h1 className="mt-6 font-sans text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl">
            The learning platform that
            <br />
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              knows what you don't.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
            MeisterUp models your existing knowledge, finds the exact gaps that matter, and
            generates a personalized curriculum for any technical skill — from Rust to system design
            to prompt engineering.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-black transition hover:bg-white/90"
            >
              Take the 60-second assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#platform"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[14px] font-medium text-white/90 backdrop-blur transition hover:bg-white/[0.06]"
            >
              <Play className="h-3.5 w-3.5" />
              See how it thinks
            </a>
          </div>

          <p className="mt-6 text-[12px] text-white/40">
            Free tier · No card required · SOC 2 in progress
          </p>
        </motion.div>

        <HeroCanvas />
      </div>
    </section>
  );
}

/* Hero canvas — an animated knowledge graph + adaptive path */

function HeroCanvas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-16 max-w-6xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-black/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50">
            <Lock className="h-3 w-3" /> meisterup.com / learn / python
          </div>
          <div className="w-12" />
        </div>

        <div className="grid grid-cols-12 gap-0">
          {/* Left rail — learner state */}
          <div className="col-span-3 border-r border-white/[0.06] p-5">
            <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              Learner model
            </div>
            <div className="mt-3 space-y-3">
              {[
                { k: "Transferred from Java", v: 78, color: "bg-emerald-400" },
                { k: "Python idioms", v: 24, color: "bg-amber-400" },
                { k: "Async runtime", v: 41, color: "bg-cyan-400" },
                { k: "Type system", v: 62, color: "bg-indigo-400" },
              ].map((s, i) => (
                <div key={s.k}>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-white/70">{s.k}</span>
                    <span className="font-mono tabular-nums text-white/50">{s.v}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.v}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                      className={cn("h-full rounded-full", s.color)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-white/40">
                <Brain className="h-3 w-3" /> Next best concept
              </div>
              <div className="mt-1.5 text-[13px] font-semibold text-white">List comprehensions</div>
              <div className="mt-0.5 text-[11px] text-white/50">+12 mastery · 4 min est.</div>
            </div>
          </div>

          {/* Center — knowledge graph */}
          <div className="relative col-span-6 h-[420px] overflow-hidden">
            <KnowledgeGraph />
          </div>

          {/* Right rail — active activity */}
          <div className="col-span-3 border-l border-white/[0.06] p-5">
            <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              Session · Q 3 / 5
            </div>
            <div className="mt-3 text-[13px] font-medium text-white">
              Which output does this expression produce?
            </div>
            <pre className="mt-3 overflow-hidden rounded-md border border-white/[0.06] bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/80">
              <span className="text-fuchsia-300">[x*x</span>{" "}
              <span className="text-cyan-300">for</span> x <span className="text-cyan-300">in</span>{" "}
              <span className="text-emerald-300">range</span>(5){" "}
              <span className="text-cyan-300">if</span> x % 2
              <span className="text-fuchsia-300">]</span>
            </pre>
            <div className="mt-3 space-y-1.5">
              {["[0,1,4,9,16]", "[1,9]", "[1,9,25]", "[0,4,16]"].map((o, i) => (
                <motion.div
                  key={o}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-2.5 py-1.5 font-mono text-[11px]",
                    i === 1
                      ? "border-emerald-400/40 bg-emerald-400/[0.06] text-emerald-200"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60",
                  )}
                >
                  <span>{o}</span>
                  {i === 1 && <Check className="h-3 w-3" />}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5 text-[11px] text-white/50">
              <span className="text-white/70">Reasoning:</span> range(5) filtered by odd → 1, 3 →
              squared.
            </div>
          </div>
        </div>

        {/* Bottom bar — telemetry */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/30 px-4 py-2 text-[11px] text-white/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
              Adapting in real-time
            </span>
            <span className="font-mono">latency · 41ms</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>concepts: 214</span>
            <span>mastered: 47</span>
            <span>next-review: 3</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Animated knowledge graph SVG */
function KnowledgeGraph() {
  const nodes = [
    { id: "vars", label: "Vars", x: 90, y: 90, state: "mastered" },
    { id: "types", label: "Types", x: 200, y: 60, state: "mastered" },
    { id: "func", label: "Functions", x: 310, y: 100, state: "mastered" },
    { id: "iter", label: "Iterables", x: 160, y: 180, state: "mastered" },
    { id: "compr", label: "Comprehensions", x: 300, y: 220, state: "active" },
    { id: "gen", label: "Generators", x: 440, y: 170, state: "next" },
    { id: "dec", label: "Decorators", x: 470, y: 300, state: "next" },
    { id: "async", label: "Async", x: 320, y: 340, state: "locked" },
    { id: "ctx", label: "Contexts", x: 170, y: 320, state: "locked" },
  ];
  const edges: [string, string][] = [
    ["vars", "types"],
    ["types", "func"],
    ["vars", "iter"],
    ["iter", "compr"],
    ["func", "compr"],
    ["func", "gen"],
    ["compr", "gen"],
    ["gen", "dec"],
    ["compr", "async"],
    ["gen", "async"],
    ["iter", "ctx"],
    ["dec", "async"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const colorFor = (s: string) =>
    s === "mastered"
      ? "#34d399"
      : s === "active"
        ? "#a78bfa"
        : s === "next"
          ? "#22d3ee"
          : "#3f3f46";

  return (
    <svg viewBox="0 0 560 420" className="h-full w-full">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const A = byId[a];
        const B = byId[b];
        const active = A.state === "mastered" && (B.state === "mastered" || B.state === "active");
        return (
          <motion.line
            key={i}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={active ? "#a78bfa" : "#ffffff"}
            strokeOpacity={active ? 0.5 : 0.08}
            strokeWidth={active ? 1.2 : 1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.06, type: "spring", stiffness: 120 }}
        >
          {n.state === "active" && (
            <>
              <circle cx={n.x} cy={n.y} r="42" fill="url(#halo)" />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="18"
                fill="none"
                stroke="#a78bfa"
                strokeOpacity="0.6"
                animate={{ r: [18, 30, 18], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </>
          )}
          <circle cx={n.x} cy={n.y} r="8" fill={colorFor(n.state)} stroke="black" strokeWidth="2" />
          <text
            x={n.x}
            y={n.y + 22}
            textAnchor="middle"
            fill={n.state === "locked" ? "#52525b" : "#e4e4e7"}
            fontSize="10"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  LOGO STRIP                                                    */
/* ────────────────────────────────────────────────────────────── */

function LogoStrip() {
  const logos = ["STRIPE", "VERCEL", "LINEAR", "ANTHROPIC", "SUPABASE", "NOTION", "RAMP"];
  return (
    <section className="border-y border-white/[0.06] bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
          Engineers from teams at
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((l) => (
            <div
              key={l}
              className="text-[13px] font-semibold tracking-[0.28em] text-white/30 transition hover:text-white/70"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  PLATFORM PILLARS                                              */
/* ────────────────────────────────────────────────────────────── */

function Pillars() {
  const items = [
    {
      icon: Brain,
      title: "Models what you already know",
      body: "The engine estimates prior knowledge from adjacent skills. Coming from Java? You skip variables and loops on day one.",
    },
    {
      icon: Network,
      title: "Knowledge graph, not chapters",
      body: "Every concept is a node with prerequisites, sibling ideas, and common misconceptions. Learn by dependency, not table of contents.",
    },
    {
      icon: Target,
      title: "The optimal next lesson",
      body: "A Bayesian mastery model chooses the highest-value concept for you right now — factoring difficulty, retention, and confidence.",
    },
    {
      icon: LineChart,
      title: "Continuously calibrated",
      body: "Every answer updates the model. Weak areas surface. Mastered concepts fade into scheduled review. Nothing is wasted.",
    },
  ];
  return (
    <section id="platform" className="relative border-b border-white/[0.06] py-28">
      <GlowOrb className="left-1/3 top-1/2 h-[420px] w-[420px] bg-indigo-500/20" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>The engine</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Not a course.
            <span className="text-white/40"> An engine.</span>
          </h2>
          <p className="mt-4 text-[16px] text-white/60">
            Four systems working in concert — so the platform can teach a Rust veteran and a Python
            beginner from the same skill tree.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative bg-black p-7"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <it.icon className="h-4.5 w-4.5 text-white/80" />
              </div>
              <div className="mt-5 text-[15px] font-semibold text-white">{it.title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">{it.body}</p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  ADAPTIVE ASSESSMENT DEMO                                      */
/* ────────────────────────────────────────────────────────────── */

function AssessmentDemo() {
  const steps = [
    {
      q: "How would you describe your comfort with Python?",
      a: "I've written Java for 6 years, no Python.",
      inference: "Estimated ability: intermediate general programming, no Python-specific.",
    },
    {
      q: "Given `x = [1,2,3]; y = x; y.append(4)` — what is `x`?",
      a: "[1,2,3,4] — references share memory.",
      inference: "Mastered: aliasing, mutability. Skipping 4 lessons.",
    },
    {
      q: "What does `@staticmethod` change about a method?",
      a: "Not sure.",
      inference: "Gap detected: decorators & class semantics. Prioritized.",
    },
    {
      q: "Explain what `async def` returns when called.",
      a: "A coroutine that must be awaited.",
      inference: "Mastered: async fundamentals. Advancing to concurrency patterns.",
    },
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 3800);
    return () => clearInterval(id);
  }, [steps.length]);
  const mastery = [22, 41, 43, 68][step];

  return (
    <section id="curriculum" className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Adaptive assessment</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Six questions.
            <br />
            <span className="text-white/40">A curriculum for one.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/60">
            Instead of a 40-question exam, MeisterUp asks a handful of well-chosen questions. Each
            answer updates a probability distribution over every concept in the graph — collapsing
            weeks of onboarding into under a minute.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Rapid convergence — 4-8 questions locate you in the graph",
              "Confidence-weighted — 'not sure' is a valid, useful signal",
              "Transferable knowledge is credited automatically",
              "Re-run any time your skills change",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[14px] text-white/75">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <div className="flex items-center justify-between text-[11px] text-white/40">
              <span className="font-mono">Question {step + 1} of 6</span>
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live inference
              </span>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                animate={{ width: `${((step + 1) / 6) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="mt-6 space-y-4"
              >
                <div className="text-[15px] font-medium leading-relaxed text-white">
                  {steps[step].q}
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-[13px] text-white/70">
                  <span className="text-white/40">You:</span> {steps[step].a}
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-indigo-400/20 bg-indigo-400/[0.05] p-3">
                  <Brain className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-indigo-300" />
                  <div className="text-[12px] leading-relaxed text-indigo-100/80">
                    {steps[step].inference}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5 text-[11px]">
              <Stat label="Est. mastery" value={`${mastery}%`} />
              <Stat label="Concepts placed" value={`${8 + step * 6}`} />
              <Stat label="Time to lesson 1" value={`${28 - step * 4}s`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div className="mt-1 font-mono text-[16px] font-semibold tabular-nums text-white">
        {value}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  ACTIVITY TYPES                                                */
/* ────────────────────────────────────────────────────────────── */

function ActivityTypes() {
  const types = [
    {
      icon: Command,
      name: "Multiple choice",
      desc: "Rapid concept checks with distractors mined from real misconceptions.",
    },
    {
      icon: Terminal,
      name: "Interactive simulation",
      desc: "Run code in a sandbox. Trace state. Watch the runtime think.",
    },
    {
      icon: GitBranch,
      name: "Error detection",
      desc: "Swipe-review production code. Spot bugs, security issues, and hallucinations.",
    },
    {
      icon: Layers,
      name: "Ordering & sequencing",
      desc: "Drag steps into the correct order — request lifecycle, deployment flow.",
    },
    {
      icon: Cpu,
      name: "Scenario decisions",
      desc: "Design under constraint. Justify tradeoffs. Get graded on reasoning.",
    },
    {
      icon: Sparkles,
      name: "Explain-back",
      desc: "Teach the concept in your own words. Reviewed for accuracy and depth.",
    },
  ];
  return (
    <section className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Learning activities</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Ten ways to prove you know it.
          </h2>
          <p className="mt-4 text-[16px] text-white/60">
            Different concepts require different interactions. MeisterUp picks the right one — and
            grades reasoning, not just answers.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {types.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 transition hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <t.icon className="h-4 w-4 text-white/80" />
                </div>
                <div className="text-[14px] font-semibold text-white">{t.name}</div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/55">{t.desc}</p>
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03] opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  INTERACTIVE SWIPE DEMO                                        */
/* ────────────────────────────────────────────────────────────── */

const SWIPE_CARDS = [
  {
    title: "Auth middleware — PR #4821",
    lang: "typescript",
    code: `export function requireAuth(req, res, next) {
  const token = req.headers.authorization
  if (!token) return res.status(401).end()
  const user = jwt.decode(token) // decode, not verify
  req.user = user
  next()
}`,
    bad: true,
    concept: "JWT verification",
    why: "jwt.decode() does not check the signature. Any forged token with valid JSON is accepted. Use jwt.verify() with the shared secret.",
  },
  {
    title: "React memoization — PR #911",
    lang: "typescript",
    code: `const Row = memo(function Row({ item, onSelect }) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>
})

// parent:
<Row item={item} onSelect={id => setSelected(id)} />`,
    bad: true,
    concept: "Stable callbacks",
    why: "memo() bails out because onSelect is a new function every parent render. Wrap it in useCallback or hoist it above the render.",
  },
  {
    title: "Postgres index — migration 0043",
    lang: "sql",
    code: `CREATE INDEX CONCURRENTLY idx_orders_user_created
  ON orders (user_id, created_at DESC)
  WHERE status IN ('paid', 'refunded');`,
    bad: false,
    concept: "Partial composite index",
    why: "Correct. Composite + partial index targets the hot query path without indexing dead rows. CONCURRENTLY avoids table locks.",
  },
];

function SwipeDemo() {
  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    card: (typeof SWIPE_CARDS)[number];
  }>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(120);
  const [prevStreak, setPrevStreak] = useState(0);
  const [prevXp, setPrevXp] = useState(120);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-200, -60, 0, 60, 200], [0.3, 1, 1, 1, 0.3]);
  const approveOpacity = useTransform(x, [20, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, -20], [1, 0]);

  const card = SWIPE_CARDS[i % SWIPE_CARDS.length];

  function resolve(dir: "left" | "right") {
    const userSaysBad = dir === "left";
    const correct = userSaysBad === card.bad;
    setPrevStreak(streak);
    setPrevXp(xp);
    setFeedback({ correct, card });
    if (correct) {
      setStreak((s) => s + 1);
      setXp((v) => v + 25);
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
    <section id="demo" className="relative border-b border-white/[0.06] py-28">
      <GlowOrb className="right-1/4 top-1/3 h-[380px] w-[380px] bg-fuchsia-500/20" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Try one activity</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Approve. Reject.
            <br />
            <span className="text-white/40">Build engineering judgment.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/60">
            A live sample of one activity type — swipe-based code review, drawn from anonymized
            production PRs. Reasoning matters more than the swipe: after each card, MeisterUp asks{" "}
            <em>why</em>.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            <StatCard icon={Flame} label="Streak" value={streak} />
            <StatCard icon={Zap} label="XP" value={xp} />
            <StatCard icon={TrendingUp} label="Mastery" value="B+" />
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
                className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
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
                  {feedback.correct ? "Correct call" : "Not quite"}
                </div>
                <div className="mt-4 text-[15px] font-semibold text-white">
                  {feedback.card.concept}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                  {feedback.card.why}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button
                    onClick={undo}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Undo last swipe"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Undo swipe
                  </button>
                  <button
                    onClick={nextCard}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-black hover:bg-white/90 cursor-pointer"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!feedback && (
            <div className="pointer-events-none absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2 text-[11px] text-white/40">
              <span>Drag or use ← →</span>
            </div>
          )}
        </div>
      </div>
      <KeyboardBridge onResolve={resolve} active={!feedback} />
    </section>
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
  card: (typeof SWIPE_CARDS)[number];
  approveOpacity: import("framer-motion").MotionValue<number>;
  rejectOpacity: import("framer-motion").MotionValue<number>;
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

/* Minimal syntax highlighter — keywords / strings / comments */
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
      const p = parts[i];
      if (p.c) continue;
      const out: Part[] = [];
      let last = 0;
      p.t.replace(re, (m, ..._a) => {
        const idx = _a[_a.length - 2] as number;
        if (idx > last) out.push({ t: p.t.slice(last, idx) });
        out.push({ t: m, c: cls });
        last = idx + m.length;
        return m;
      });
      if (last < p.t.length) out.push({ t: p.t.slice(last) });
      parts.splice(i, 1, ...out);
      i += out.length - 1;
    }
  };
  apply(CMT, "text-white/30 italic");
  apply(STR, "text-emerald-300");
  apply(KW, "text-fuchsia-300");
  apply(NUM, "text-cyan-300");
  return parts.map((p, i) =>
    p.c ? (
      <span key={i} className={p.c}>
        {p.t}
      </span>
    ) : (
      <span key={i}>{p.t}</span>
    ),
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: import("react").ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-mono text-[18px] font-semibold text-white">{value}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  SKILL LIBRARY                                                 */
/* ────────────────────────────────────────────────────────────── */

const SKILL_TAGS = [
  { name: "Python", learners: "48k", tone: "from-yellow-300/20 to-yellow-500/5" },
  { name: "Rust", learners: "12k", tone: "from-orange-400/20 to-orange-600/5" },
  { name: "Go", learners: "19k", tone: "from-cyan-300/20 to-cyan-500/5" },
  { name: "TypeScript", learners: "61k", tone: "from-blue-400/20 to-blue-600/5" },
  { name: "React", learners: "54k", tone: "from-sky-400/20 to-sky-600/5" },
  { name: "SQL", learners: "37k", tone: "from-indigo-400/20 to-indigo-600/5" },
  { name: "System Design", learners: "29k", tone: "from-fuchsia-400/20 to-fuchsia-600/5" },
  { name: "Kubernetes", learners: "16k", tone: "from-blue-300/20 to-blue-500/5" },
  { name: "Docker", learners: "22k", tone: "from-sky-300/20 to-sky-500/5" },
  { name: "AWS", learners: "31k", tone: "from-amber-400/20 to-amber-600/5" },
  { name: "Machine Learning", learners: "27k", tone: "from-emerald-400/20 to-emerald-600/5" },
  { name: "Prompt Engineering", learners: "44k", tone: "from-violet-400/20 to-violet-600/5" },
  { name: "Cybersecurity", learners: "18k", tone: "from-rose-400/20 to-rose-600/5" },
  { name: "Linux", learners: "24k", tone: "from-zinc-300/20 to-zinc-500/5" },
  { name: "Git", learners: "39k", tone: "from-red-400/20 to-red-600/5" },
  { name: "Networking", learners: "14k", tone: "from-teal-400/20 to-teal-600/5" },
  { name: "DevOps", learners: "21k", tone: "from-lime-400/20 to-lime-600/5" },
  { name: "AI Engineering", learners: "33k", tone: "from-purple-400/20 to-purple-600/5" },
  { name: "Data Structures", learners: "42k", tone: "from-pink-400/20 to-pink-600/5" },
  { name: "Statistics", learners: "11k", tone: "from-green-400/20 to-green-600/5" },
];

function SkillLibrary() {
  return (
    <section id="skills" className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Skill library</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
              Any technical skill.
              <span className="text-white/40"> One engine.</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] text-white/60">
            The knowledge graph works for languages, frameworks, systems, and concepts. New skill
            trees ship weekly.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SKILL_TAGS.map((s, i) => (
            <motion.a
              key={s.name}
              href="#demo"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 12) * 0.02 }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                  s.tone,
                )}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-white">{s.name}</div>
                  <div className="mt-0.5 text-[11px] text-white/50">{s.learners} learners</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  DASHBOARD MOCK                                                */
/* ────────────────────────────────────────────────────────────── */

function DashboardShowcase() {
  return (
    <section className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Your progress</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            A map of what you know.
          </h2>
          <p className="mt-4 text-[16px] text-white/60">
            Forget "10 lessons completed." MeisterUp shows you mastery, retention, velocity, and
            where to invest next.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-black">
          <div className="grid grid-cols-12 gap-0 border-b border-white/[0.06]">
            <div className="col-span-3 border-r border-white/[0.06] p-5">
              <div className="text-[10px] uppercase tracking-widest text-white/40">
                Current skill
              </div>
              <div className="mt-1.5 text-[18px] font-semibold text-white">Python</div>
              <div className="mt-4 space-y-4">
                <Metric label="Overall mastery" value="72%" />
                <Metric label="Concepts mastered" value="41 / 68" />
                <Metric label="Retention (7-day)" value="94%" />
                <Metric label="Learning velocity" value="+12% wk" tone="emerald" />
              </div>
            </div>
            <div className="col-span-6 border-r border-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  Mastery over time
                </div>
                <div className="flex gap-1 text-[10px] text-white/40">
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-white/70">30d</span>
                  <span className="px-1.5 py-0.5">90d</span>
                  <span className="px-1.5 py-0.5">All</span>
                </div>
              </div>
              <MasteryChart />
            </div>
            <div className="col-span-3 p-5">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Next up</div>
              <div className="mt-3 space-y-2.5">
                {[
                  { c: "Context managers", m: "prereq mastered", t: "5 min" },
                  { c: "AsyncIO patterns", m: "weakness detected", t: "9 min" },
                  { c: "Metaclasses", m: "stretch concept", t: "12 min" },
                ].map((r) => (
                  <div
                    key={r.c}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className="text-[13px] font-medium text-white">{r.c}</div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-white/50">
                      <span>{r.m}</span>
                      <span className="font-mono">{r.t}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-widest text-white/40">
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
      </div>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "emerald" }) {
  return (
    <div>
      <div className="text-[11px] text-white/50">{label}</div>
      <div
        className={cn(
          "mt-0.5 font-mono text-[18px] font-semibold tabular-nums",
          tone === "emerald" ? "text-emerald-300" : "text-white",
        )}
      >
        {value}
      </div>
    </div>
  );
}

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
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
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
        fill="url(#fillGrad)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function Heatmap() {
  const cells = useMemo(() => {
    return Array.from({ length: 7 * 24 }, () => Math.random());
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
    <div
      className="mt-4 grid grid-cols-24 gap-1"
      style={{ gridTemplateColumns: "repeat(24, minmax(0,1fr))" }}
    >
      {cells.map((v, i) => (
        <div
          key={i}
          className={cn("h-4 rounded-sm transition hover:scale-125", colorFor(v))}
          title={`concept ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  TESTIMONIALS                                                  */
/* ────────────────────────────────────────────────────────────── */

const QUOTES = [
  {
    q: "I came in with 8 years of backend. MeisterUp skipped the boring parts and had me writing idiomatic Rust in a week. No course has ever done that.",
    a: "Marielle O.",
    r: "Staff Engineer, Fintech",
  },
  {
    q: "The knowledge graph is the thing. I finally understand what I don't know — and the platform actually teaches me that, not what a curriculum author guessed.",
    a: "Devansh K.",
    r: "SRE, Series C SaaS",
  },
  {
    q: "It's the first learning tool that respects my time. Every session feels calibrated. Nothing wasted.",
    a: "Priya S.",
    r: "ML Engineer",
  },
];

function Testimonials() {
  return (
    <section className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.a}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-7"
            >
              <blockquote className="text-[15px] leading-relaxed text-white/85">"{q.q}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 text-[12px] font-semibold text-white">
                  {q.a
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white">{q.a}</div>
                  <div className="text-[11px] text-white/50">{q.r}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  PRICING                                                       */
/* ────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Learner",
    price: "Free",
    tag: "Get placed",
    body: "For self-directed engineers exploring one skill.",
    features: [
      "1 active skill",
      "Adaptive assessment",
      "Personalized curriculum",
      "Basic progress analytics",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$18",
    per: "/mo",
    tag: "Most popular",
    body: "For engineers investing in a long-horizon skill map.",
    features: [
      "Unlimited skills",
      "All activity types",
      "AI tutor & explain-back",
      "Spaced repetition",
      "Concept heatmap & velocity",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$32",
    per: "/seat",
    tag: "Growing teams",
    body: "For teams levelling up together with shared skill maps.",
    features: [
      "Everything in Pro",
      "Team skill dashboards",
      "Manager review sessions",
      "SSO & SCIM",
      "Priority support",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Priced for the way you learn.
          </h2>
          <p className="mt-4 text-[16px] text-white/60">
            Start free forever. Upgrade when you're ready to master more than one skill.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7",
                p.highlight
                  ? "border-white/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02]"
                  : "border-white/10 bg-white/[0.02]",
              )}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-black">
                  {p.tag}
                </div>
              )}
              <div className="text-[13px] font-medium text-white/60">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="text-4xl font-semibold tracking-tight text-white">{p.price}</div>
                {p.per && <div className="text-[13px] text-white/50">{p.per}</div>}
              </div>
              <p className="mt-2 text-[13px] text-white/55">{p.body}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-white/75">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#demo"
                className={cn(
                  "mt-7 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold transition",
                  p.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.06]",
                )}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  FAQ                                                           */
/* ────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "How is this different from an online course?",
    a: "Courses are linear and identical for every learner. MeisterUp generates a unique curriculum for every user, based on demonstrated knowledge — you skip what you know and drill what you don't.",
  },
  {
    q: "How does the platform know what I already know?",
    a: "A short adaptive assessment estimates your ability using a Bayesian mastery model. It also credits transferable knowledge — coming from Java, you inherit a lot of Python fundamentals for free.",
  },
  {
    q: "What kinds of skills can I learn?",
    a: "Any technical skill with a well-defined concept graph — programming languages, frameworks, systems, cloud platforms, ML, prompt engineering, security, product, and design. New skill trees ship weekly.",
  },
  {
    q: "Is it just multiple choice?",
    a: "No. MeisterUp uses ten interaction types — simulations, error-detection swipes, ordering, scenario decisions, explain-back — and grades reasoning, not just correctness.",
  },
  {
    q: "Can teams use this?",
    a: "Yes. Team plans include shared skill maps, manager review sessions, and SSO. Teams use MeisterUp for onboarding and continuous levelling.",
  },
  {
    q: "Do you store my learning data?",
    a: "Encrypted at rest, never sold. You own your data and can export or delete it any time. SOC 2 in progress.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative border-b border-white/[0.06] py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Questions, answered.
          </h2>
        </div>
        <div className="mt-12 divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-white/[0.02]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-medium text-white">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-white/40 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-[13px] leading-relaxed text-white/60">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  CTA + FOOTER                                                  */
/* ────────────────────────────────────────────────────────────── */

function CTA() {
  return (
    <section className="relative overflow-hidden py-28">
      <GlowOrb className="left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/40" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">
          Learn like the platform
          <br />
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            was built for you.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[16px] text-white/60">
          Because it is. Take the 60-second assessment and see your first personalized curriculum in
          under a minute.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:bg-white/90"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#skills"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-[14px] font-medium text-white backdrop-blur hover:bg-white/[0.06]"
          >
            Browse skills
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
              <span className="text-[15px] font-semibold text-white">MeisterUp</span>
            </div>
            <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/50">
              The adaptive learning platform for engineers. Built for the way you actually learn.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#" className="text-white/40 hover:text-white">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/40 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          {[
            {
              t: "Platform",
              l: ["How it works", "Knowledge graph", "Skill library", "Roadmap"],
            },
            {
              t: "Company",
              l: ["About", "Careers", "Blog", "Contact"],
            },
            {
              t: "Legal",
              l: ["Privacy", "Terms", "Security", "Status"],
            },
          ].map((col) => (
            <div key={col.t}>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {col.t}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.l.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-[13px] text-white/60 hover:text-white">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-6 text-[11px] text-white/40">
          <div>© {new Date().getFullYear()} MeisterUp, Inc.</div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  PAGE                                                          */
/* ────────────────────────────────────────────────────────────── */

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white antialiased">
      <Nav />
      <Hero />
      <LogoStrip />
      <Pillars />
      <AssessmentDemo />
      <ActivityTypes />
      <SwipeDemo />
      <SkillLibrary />
      <DashboardShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
