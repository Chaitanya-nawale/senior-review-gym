import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Flame,
  Github,
  Play,
  Settings,
  Shield,
  Sparkles,
  Target,
  Terminal,
  X,
  Zap,
  Cpu,
  Database,
  GitBranch,
  Lock,
  Layers,
  Activity,
  Twitter,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

/* -------------------------------------------------------------------------- */
/*  MOCK DATA                                                                 */
/* -------------------------------------------------------------------------- */

const MOCK_DATA = [
  {
    id: "challenge_001",
    concept_id: "js_event_loop",
    concept_title: "Event Loop Blockers",
    type: "spot_hallucination",
    code_snippet: `const crypto = require('crypto');

app.post('/hash', (req, res) => {
  const file = req.body.file;
  // CPU bound crypto runs synchronously
  const hash = crypto.pbkdf2Sync(file, 'salt', 100000, 64, 'sha512');
  res.send(hash);
});`,
    language: "javascript",
    difficulty: "intermediate",
    bug_line: 6,
    mcq_question: "Why will this PR degrade performance under high traffic?",
    options: [
      { id: "A", text: "It blocks the single-threaded V8 event loop entirely." },
      { id: "B", text: "The file buffer is not properly garbage collected." },
      { id: "C", text: "pbkdf2Sync is deprecated in newer Node versions." },
      { id: "D", text: "The route handler lacks asynchronous error boundaries." },
    ],
    correct_option_id: "A",
    explanation:
      "In Node.js, running CPU-intensive operations synchronously blocks the entire event loop, freezing the server for all other concurrent users.",
  },
  {
    id: "challenge_002",
    concept_id: "react_stale_closure",
    concept_title: "Stale Closures in Hooks",
    type: "spot_hallucination",
    code_snippet: `function usePolling(url) {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      fetch(url).then(r => r.json()).then(setData);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [url]);

  return { data, count };
}`,
    language: "javascript",
    difficulty: "intermediate",
    bug_line: 8,
    mcq_question: "What is the subtle defect a senior reviewer should catch?",
    options: [
      { id: "A", text: "fetch should be wrapped in AbortController for cleanup." },
      { id: "B", text: "setCount closes over a stale `count`, so it never advances past 1." },
      { id: "C", text: "setInterval leaks memory across re-renders." },
      { id: "D", text: "The dependency array should include `data`." },
    ],
    correct_option_id: "B",
    explanation:
      "The effect only re-runs when `url` changes, so the interval callback captures the initial `count`. Use the functional updater form: setCount(c => c + 1).",
  },
  {
    id: "challenge_003",
    concept_id: "sql_n_plus_one",
    concept_title: "N+1 Query Antipattern",
    type: "spot_hallucination",
    code_snippet: `async function getFeed(userId) {
  const posts = await db.post.findMany({ where: { userId } });
  for (const post of posts) {
    post.author = await db.user.findUnique({ where: { id: post.authorId } });
    post.likes = await db.like.count({ where: { postId: post.id } });
  }
  return posts;
}`,
    language: "javascript",
    difficulty: "advanced",
    bug_line: 4,
    mcq_question: "Why will this endpoint collapse at moderate scale?",
    options: [
      { id: "A", text: "findMany doesn't use an index on userId." },
      { id: "B", text: "The transaction isolation level is too strict." },
      { id: "C", text: "It issues N+1 queries — one per post — instead of batching." },
      { id: "D", text: "Prisma requires `await Promise.all` for parallelism." },
    ],
    correct_option_id: "C",
    explanation:
      "Each post triggers two additional queries. Use `include` or a DataLoader to batch author and like lookups into constant-query joins.",
  },
];

/* -------------------------------------------------------------------------- */
/*  LANDING PAGE                                                              */
/* -------------------------------------------------------------------------- */

function LandingPage() {
  const appRef = useRef<HTMLDivElement>(null);
  const scrollToApp = () =>
    appRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="min-h-screen bg-black text-gray-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
      <Nav onDemo={scrollToApp} />
      <Hero onDemo={scrollToApp} />
      <TrustedBy />
      <HowItWorks />
      <WhyItWorks />
      <div ref={appRef}>
        <InteractiveDemo />
      </div>
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  NAV                                                                       */
/* -------------------------------------------------------------------------- */

function Nav({ onDemo }: { onDemo: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <div className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.03]">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.25} />
          </div>
          <span>Zero-Syntax</span>
          <span className="ml-1 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
            v1.0
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          <a href="#" className="transition-colors hover:text-white">Docs</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onDemo}
            className="hidden rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:block"
          >
            Sign in
          </button>
          <button
            onClick={onDemo}
            className="group inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black transition-all hover:bg-gray-200"
          >
            Start training
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO                                                                      */
/* -------------------------------------------------------------------------- */

function Hero({ onDemo }: { onDemo: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(16,185,129,0.10), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="font-mono">v1.0 · now in public beta</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[68px]"
          >
            Learn to read code<br />
            <span className="text-gray-500">like a</span>{" "}
            <span className="text-white">senior engineer</span>
            <span className="text-emerald-400">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400"
          >
            Zero-Syntax trains your engineering judgment by putting you inside
            real production pull requests. Swipe to approve. Swipe to reject.
            No syntax. No typing. Just the calls that separate mid from staff.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={onDemo}
              className="group inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-all hover:bg-gray-200"
            >
              Start training
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onDemo}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-200 transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <Play className="h-3.5 w-3.5" />
              View demo
            </button>
          </motion.div>

          <div className="mt-10 flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              1,200+ curated PRs
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Ships weekly
            </div>
          </div>
        </div>

        {/* mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      {/* glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(16,185,129,0.18), transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div className="rotate-[-1.5deg] rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 shadow-2xl">
        <TerminalCard challenge={MOCK_DATA[0]} compact />
        <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-gray-500">
          <span className="font-mono">swipe · approve or reject</span>
          <span className="flex items-center gap-1 font-mono text-emerald-400">
            <Sparkles className="h-3 w-3" /> +25 XP
          </span>
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute -left-6 top-8 hidden rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-xs shadow-xl backdrop-blur md:block"
      >
        <div className="flex items-center gap-2 text-red-400">
          <X className="h-3.5 w-3.5" />
          <span className="font-mono">REJECT</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500">blocks event loop</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="absolute -right-4 bottom-16 hidden rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-xs shadow-xl backdrop-blur md:block"
      >
        <div className="flex items-center gap-2 text-emerald-400">
          <Flame className="h-3.5 w-3.5" />
          <span className="font-mono">12 day streak</span>
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500">senior auditor · lvl 4</div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TRUSTED BY                                                                */
/* -------------------------------------------------------------------------- */

function TrustedBy() {
  const logos = ["Vercel", "Linear", "Stripe", "Ramp", "Supabase", "Cloudflare", "Fly.io"];
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Trusted by engineers at
        </p>
        <div className="mt-6 grid grid-cols-3 items-center gap-x-8 gap-y-6 md:grid-cols-7">
          {logos.map((l) => (
            <div
              key={l}
              className="text-center text-lg font-semibold tracking-tight text-gray-500 grayscale transition-all hover:text-gray-300"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  HOW IT WORKS                                                              */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  const items = [
    {
      n: "01",
      icon: Terminal,
      title: "Review code",
      body: "You're dropped into a real production diff. Read the intent. Read the code. Judge it.",
    },
    {
      n: "02",
      icon: Shield,
      title: "Detect bugs",
      body: "Swipe left to reject. Swipe right to LGTM. Explain your reasoning with a targeted MCQ.",
    },
    {
      n: "03",
      icon: Zap,
      title: "Level up",
      body: "Earn XP, streaks, and mastery per concept. Track blind spots. Get promoted.",
    },
  ];
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader eyebrow="How it works" title="Three steps to a sharper eye." />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.n}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.03]">
                  <it.icon className="h-4 w-4 text-emerald-400" strokeWidth={2.25} />
                </div>
                <span className="font-mono text-xs text-gray-600">{it.n}</span>
              </div>
              <h3 className="mt-8 text-lg font-semibold tracking-tight text-white">
                {it.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-gray-400">{sub}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  WHY IT WORKS                                                              */
/* -------------------------------------------------------------------------- */

function WhyItWorks() {
  const stats = [
    { k: "10×", v: "more time reading than writing code" },
    { k: "62%", v: "of senior bugs are caught in review, not tests" },
    { k: "1.2k", v: "curated production PRs, and growing" },
  ];
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Why it works"
              title="Engineers read far more code than they write."
              sub="Yet almost no tools train the skill. Zero-Syntax builds pattern recognition the way senior engineers actually built it — thousands of reps of judging other people's code."
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((s) => (
              <div
                key={s.k}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="font-mono text-4xl font-semibold tracking-tight text-white">
                  {s.k}
                </div>
                <p className="mt-2 text-sm text-gray-400">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  INTERACTIVE DEMO (embed app)                                              */
/* -------------------------------------------------------------------------- */

function InteractiveDemo() {
  return (
    <section id="demo" className="border-b border-white/5 bg-[#050505]">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/80">
            Try it
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Review a real PR. Right now.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">
            Drag the card left to reject, right to approve. Your judgment is
            immediately tested with a targeted question.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-[3rem]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(16,185,129,0.12), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <SwipeGymApp />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FEATURES GRID                                                             */
/* -------------------------------------------------------------------------- */

function FeaturesGrid() {
  const items = [
    { icon: Layers, title: "Architecture reviews", body: "Judge boundaries, modules, and dependency flow." },
    { icon: Activity, title: "Performance bugs", body: "Spot event-loop blockers, N+1s, and hot paths." },
    { icon: Lock, title: "Security vulnerabilities", body: "SQL injection, SSRF, auth bypass, secrets in code." },
    { icon: Cpu, title: "Concurrency & async", body: "Race conditions, deadlocks, and stale closures." },
    { icon: GitBranch, title: "React & Node.js", body: "Hooks pitfalls, memory leaks, and lifecycle traps." },
    { icon: Database, title: "Database queries", body: "Index misses, transaction scope, and query plans." },
    { icon: Terminal, title: "Distributed systems", body: "Idempotency, retries, and consistency trade-offs." },
    { icon: Sparkles, title: "System design", body: "Rate limits, back-pressure, and failure modes." },
  ];
  return (
    <section id="features" className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          eyebrow="Features"
          title="Every category a senior is expected to catch."
        />
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="group flex flex-col gap-4 bg-black p-6 transition-colors hover:bg-white/[0.02]"
            >
              <it.icon className="h-4 w-4 text-emerald-400" strokeWidth={2.25} />
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">{it.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS                                                              */
/* -------------------------------------------------------------------------- */

function Testimonials() {
  const items = [
    {
      quote:
        "The first tool that actually trains code review. My team's PR feedback got measurably sharper in a month.",
      name: "Ava Chen",
      role: "Staff Engineer, Ramp",
    },
    {
      quote:
        "It's not Duolingo for coding. It's the flight simulator for the part of engineering nobody teaches.",
      name: "Marcus Odom",
      role: "Principal, Cloudflare",
    },
    {
      quote:
        "I promoted two engineers last quarter. Both credited Zero-Syntax as the reason review comments started landing.",
      name: "Priya Nair",
      role: "EM, Vercel",
    },
  ];
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader eyebrow="Testimonials" title="Reviewed by senior engineers." />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
            >
              <blockquote className="text-sm leading-relaxed text-gray-200">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-medium text-gray-300">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{t.name}</div>
                  <div className="text-[11px] text-gray-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PRICING                                                                   */
/* -------------------------------------------------------------------------- */

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      features: ["10 PRs / day", "Core concepts", "Streaks & XP", "Community"],
      cta: "Start free",
      featured: false,
    },
    {
      name: "Pro",
      price: "$12",
      cadence: "/ month",
      features: [
        "Unlimited PRs",
        "All concept tracks",
        "Personal blind-spot report",
        "Priority new content",
        "Keyboard-first shortcuts",
      ],
      cta: "Go Pro",
      featured: true,
    },
    {
      name: "Teams",
      price: "$29",
      cadence: "/ seat / mo",
      features: [
        "Everything in Pro",
        "Org-level analytics",
        "Custom PR sets",
        "SSO & SCIM",
        "Dedicated support",
      ],
      cta: "Contact sales",
      featured: false,
    },
  ];
  return (
    <section id="pricing" className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader eyebrow="Pricing" title="Simple. Priced like a coffee." />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "relative rounded-xl border p-6 transition-all " +
                (t.featured
                  ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20")
              }
            >
              {t.featured && (
                <div className="absolute -top-2 left-6 rounded-full border border-emerald-500/40 bg-black px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Most popular
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {t.price}
                </span>
                <span className="text-sm text-gray-500">{t.cadence}</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={
                  "mt-8 w-full rounded-md px-4 py-2 text-sm font-medium transition-all " +
                  (t.featured
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.06]")
                }
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

function FAQ() {
  const items = [
    {
      q: "Do I actually write code?",
      a: "No. Zero-Syntax trains the read-and-judge muscle, not typing. You review diffs and answer targeted questions. That's the point.",
    },
    {
      q: "Where do the PRs come from?",
      a: "Real production code from open-source projects, curated and rewritten by senior engineers into review-length challenges.",
    },
    {
      q: "Which stacks are covered?",
      a: "Node, React, TypeScript, Go, Python, and Rust today. Distributed systems and database internals throughout.",
    },
    {
      q: "Can my team use it together?",
      a: "Yes — the Teams plan includes org analytics, custom PR sets, and SSO.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-b border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <SectionHeader eyebrow="FAQ" title="Questions, answered." />
        <div className="mt-10 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <button
                key={it.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-white">{it.q}</span>
                  <ChevronDown
                    className={
                      "h-4 w-4 flex-none text-gray-500 transition-transform " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-gray-400">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.03]">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <span className="font-semibold text-white">Zero-Syntax</span>
          <span className="text-gray-600">·</span>
          <span>© 2026</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Docs</a>
          <a href="#" className="hover:text-white">Changelog</a>
          <a href="#" className="hover:text-white">Careers</a>
          <a href="#" className="hover:text-white" aria-label="GitHub"><Github className="h-4 w-4" /></a>
          <a href="#" className="hover:text-white" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
 *  APPLICATION — SwipeGymApp
 * ========================================================================== */

type Challenge = (typeof MOCK_DATA)[number];
type InteractionState = "idle" | "swiping" | "revealBug" | "mcq" | "result";
type SwipeOutcome = null | "approved" | "rejected";

function SwipeGymApp() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [xp, setXp] = useState(450);
  const [streak] = useState(12);
  const [interactionState, setInteractionState] = useState<InteractionState>("idle");
  const [swipeOutcome, setSwipeOutcome] = useState<SwipeOutcome>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [particles, setParticles] = useState<number[]>([]);

  const challenge = MOCK_DATA[currentCardIndex % MOCK_DATA.length];
  const level = 4;
  const xpForLevel = 1000;
  const xpProgress = Math.min(100, ((xp % xpForLevel) / xpForLevel) * 100);

  const handleSwipe = (dir: "left" | "right") => {
    if (dir === "right") {
      // approve = wrong (there's a bug)
      setSwipeOutcome("approved");
      setInteractionState("revealBug");
      setXp((x) => Math.max(0, x - 5));
    } else {
      // reject = correct → open MCQ
      setSwipeOutcome("rejected");
      setInteractionState("mcq");
    }
  };

  const handleAnswer = (id: string) => {
    setSelectedOption(id);
    if (id === challenge.correct_option_id) {
      setXp((x) => x + 25);
      const burst = Array.from({ length: 14 }, (_, i) => i + Date.now());
      setParticles(burst);
      setTimeout(() => setParticles([]), 900);
    } else {
      setXp((x) => Math.max(0, x - 5));
    }
    setInteractionState("result");
  };

  const nextCard = () => {
    setSelectedOption(null);
    setSwipeOutcome(null);
    setInteractionState("idle");
    setCurrentCardIndex((i) => i + 1);
  };

  return (
    <div className="relative mx-auto flex h-[760px] w-full max-w-md flex-col overflow-hidden rounded-[2.25rem] border border-white/10 bg-black text-gray-100 shadow-2xl">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-black/60 px-5 py-4 backdrop-blur">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 font-mono text-[10px] font-semibold text-emerald-400">
              L{level}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">Senior Auditor</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                {xp} XP
              </div>
            </div>
          </div>
          <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-emerald-400"
              initial={false}
              animate={{ width: `${xpProgress}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              style={{ boxShadow: "0 0 12px rgba(16,185,129,0.5)" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            <span className="font-mono text-xs font-semibold text-white">{streak}</span>
          </div>
          <button
            aria-label="Settings"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-colors hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Concept pill */}
      <div className="flex justify-center py-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs">
          <Target className="h-3 w-3 text-emerald-400" />
          <span className="font-mono text-gray-300">🎯 {challenge.concept_id}</span>
        </div>
      </div>

      {/* Card stack area */}
      <div className="relative flex-1 px-4">
        {/* particles */}
        <AnimatePresence>
          {particles.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
              {particles.map((p, i) => {
                const angle = (i / particles.length) * Math.PI * 2;
                const dist = 90 + Math.random() * 60;
                return (
                  <motion.span
                    key={p}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist,
                      scale: 0.4,
                    }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400"
                    style={{ boxShadow: "0 0 8px rgba(16,185,129,0.9)" }}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Ghost background card */}
        <div className="absolute inset-x-4 top-2 h-[calc(100%-16px)] scale-[0.96] rounded-2xl border border-white/5 bg-white/[0.02]" />

        <AnimatePresence mode="wait">
          {interactionState === "idle" || interactionState === "swiping" ? (
            <SwipeableCard
              key={challenge.id}
              challenge={challenge}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              key={challenge.id + "-static"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative h-full"
            >
              <TerminalCard
                challenge={challenge}
                highlightBug={interactionState === "revealBug" || (interactionState === "result" && swipeOutcome === "approved")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="relative z-10 flex items-center justify-center gap-6 border-t border-white/5 bg-black/60 py-5 backdrop-blur">
        <ActionButton
          label="Reject"
          color="red"
          onClick={() => interactionState === "idle" && handleSwipe("left")}
          disabled={interactionState !== "idle"}
        >
          <X className="h-6 w-6" />
        </ActionButton>
        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-600">
          swipe · or tap
        </div>
        <ActionButton
          label="Approve"
          color="green"
          onClick={() => interactionState === "idle" && handleSwipe("right")}
          disabled={interactionState !== "idle"}
        >
          <Check className="h-6 w-6" />
        </ActionButton>
      </div>

      {/* Reveal Bug overlay (wrong approve) */}
      <AnimatePresence>
        {interactionState === "revealBug" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-end bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="w-full rounded-t-3xl border-t border-red-500/30 bg-[#0a0a0a] p-6"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/10" />
              <div className="flex items-center gap-2 text-red-400">
                <X className="h-4 w-4" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Missed bug · line {challenge.bug_line}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                You approved a defect.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {challenge.explanation}
              </p>
              <div className="mt-3 font-mono text-xs text-red-400">−5 XP</div>
              <button
                onClick={nextCard}
                className="mt-5 w-full rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                Next challenge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MCQ bottom sheet */}
      <AnimatePresence>
        {(interactionState === "mcq" || interactionState === "result") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="w-full rounded-t-3xl border-t border-white/10 bg-[#0a0a0a] p-6"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Rejected · explain why
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug text-white">
                {challenge.mcq_question}
              </h3>

              <div className="mt-4 space-y-2">
                {challenge.options.map((opt) => {
                  const isCorrect = opt.id === challenge.correct_option_id;
                  const isSelected = selectedOption === opt.id;
                  const revealed = interactionState === "result";
                  const base =
                    "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all";
                  let cls = "border-white/10 bg-white/[0.02] text-gray-200 hover:border-white/25 hover:bg-white/[0.05]";
                  if (revealed) {
                    if (isCorrect) {
                      cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-100";
                    } else if (isSelected) {
                      cls = "border-red-500/50 bg-red-500/10 text-red-100";
                    } else {
                      cls = "border-white/10 bg-white/[0.02] text-gray-500";
                    }
                  }
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={!revealed ? { x: 2 } : undefined}
                      whileTap={!revealed ? { scale: 0.99 } : undefined}
                      disabled={revealed}
                      onClick={() => handleAnswer(opt.id)}
                      className={`${base} ${cls}`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            "grid h-6 w-6 flex-none place-items-center rounded-md border font-mono text-[11px] " +
                            (revealed && isCorrect
                              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                              : revealed && isSelected
                              ? "border-red-500/50 bg-red-500/20 text-red-300"
                              : "border-white/10 bg-white/[0.03] text-gray-400")
                          }
                        >
                          {opt.id}
                        </span>
                        <span className="leading-relaxed">{opt.text}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {interactionState === "result" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 rounded-lg border border-white/10 bg-black/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          "font-mono text-xs uppercase tracking-widest " +
                          (selectedOption === challenge.correct_option_id
                            ? "text-emerald-400"
                            : "text-red-400")
                        }
                      >
                        {selectedOption === challenge.correct_option_id
                          ? "Correct · +25 XP"
                          : "Incorrect · −5 XP"}
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">
                        line {challenge.bug_line}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-300">
                      {challenge.explanation}
                    </p>
                    <button
                      onClick={nextCard}
                      className="mt-4 w-full rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
                    >
                      Next challenge
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Swipeable card                                                            */
/* -------------------------------------------------------------------------- */

function SwipeableCard({
  challenge,
  onSwipe,
}: {
  challenge: Challenge;
  onSwipe: (dir: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const approveOpacity = useTransform(x, [0, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, 0], [1, 0]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      style={{ x, rotate, touchAction: "none" }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe("right");
        else if (info.offset.x < -100) onSwipe("left");
      }}
      whileTap={{ cursor: "grabbing" }}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative h-full cursor-grab"
    >
      <TerminalCard challenge={challenge} />

      {/* Approve overlay */}
      <motion.div
        style={{ opacity: approveOpacity }}
        className="pointer-events-none absolute inset-0 flex items-start justify-start rounded-2xl border-2 border-emerald-500/60 bg-emerald-500/[0.08] p-6"
      >
        <span className="rotate-[-8deg] rounded-md border-2 border-emerald-400 bg-black/60 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
          LGTM
        </span>
      </motion.div>
      {/* Reject overlay */}
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="pointer-events-none absolute inset-0 flex items-start justify-end rounded-2xl border-2 border-red-500/60 bg-red-500/[0.08] p-6"
      >
        <span className="rotate-[8deg] rounded-md border-2 border-red-400 bg-black/60 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-red-400">
          Reject · Bug
        </span>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Terminal card with syntax highlighting                                     */
/* -------------------------------------------------------------------------- */

function TerminalCard({
  challenge,
  highlightBug = false,
  compact = false,
}: {
  challenge: Challenge;
  highlightBug?: boolean;
  compact?: boolean;
}) {
  const lines = useMemo(
    () => challenge.code_snippet.split("\n"),
    [challenge.code_snippet],
  );
  return (
    <div
      className={
        "flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
      }
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-black/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 font-mono text-[11px] text-gray-500">server.js</div>
        <div className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-600">
          <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">
            {challenge.language}
          </span>
          <span className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5">
            {challenge.difficulty}
          </span>
        </div>
      </div>

      {/* code */}
      <div className={"flex-1 overflow-auto " + (compact ? "" : "")}>
        <pre className="min-h-full font-mono text-[13px] leading-6">
          {lines.map((line, i) => {
            const lineNo = i + 1;
            const isBug = highlightBug && lineNo === challenge.bug_line;
            return (
              <div
                key={i}
                className={
                  "flex px-3 " +
                  (isBug ? "bg-red-500/10" : "")
                }
              >
                <span
                  className={
                    "w-8 flex-none select-none text-right pr-3 " +
                    (isBug ? "text-red-400" : "text-gray-600")
                  }
                >
                  {lineNo}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-words">
                  <Highlighted code={line || " "} />
                </span>
              </div>
            );
          })}
        </pre>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-white/5 bg-black/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <span>diff · pr #{842 + challenge.code_snippet.length % 100}</span>
        <span className="flex items-center gap-1 text-gray-400">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          senior review
        </span>
      </div>
    </div>
  );
}

/* ------ minimal, dependency-free JS syntax highlighter ------ */

const JS_KEYWORDS = new Set([
  "const","let","var","function","return","if","else","for","while","await","async",
  "new","class","extends","import","from","export","default","try","catch","finally",
  "throw","typeof","instanceof","in","of","break","continue","switch","case","null",
  "undefined","true","false","this","void","delete","yield","do",
]);

function Highlighted({ code }: { code: string }) {
  // Tokenize a single line. Order matters.
  const tokens: { t: string; c: string }[] = [];
  const regex =
    /(\/\/[^\n]*)|(`[^`]*`|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][A-Za-z0-9_$]*\b)|(\s+)|([{}[\]().,;:=+\-*/<>!?&|^%~]+)|([^\s])/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(code)) !== null) {
    const [full, comment, str, num, ident, ws, punct, other] = m;
    if (comment) tokens.push({ t: full, c: "text-gray-500 italic" });
    else if (str) tokens.push({ t: full, c: "text-emerald-300" });
    else if (num) tokens.push({ t: full, c: "text-orange-300" });
    else if (ident) {
      if (JS_KEYWORDS.has(ident)) tokens.push({ t: full, c: "text-blue-400" });
      else if (/^[A-Z]/.test(ident)) tokens.push({ t: full, c: "text-emerald-400" });
      else tokens.push({ t: full, c: "text-gray-200" });
    } else if (ws) tokens.push({ t: full, c: "" });
    else if (punct) tokens.push({ t: full, c: "text-gray-500" });
    else tokens.push({ t: other, c: "text-gray-200" });
  }
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} className={tok.c}>
          {tok.t}
        </span>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Action button                                                             */
/* -------------------------------------------------------------------------- */

function ActionButton({
  children,
  label,
  color,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  color: "red" | "green";
  onClick: () => void;
  disabled?: boolean;
}) {
  const styles =
    color === "green"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/70 hover:bg-emerald-500/20"
      : "border-red-500/40 bg-red-500/10 text-red-300 hover:border-red-400/70 hover:bg-red-500/20";
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={
        "grid h-14 w-14 place-items-center rounded-full border transition-colors disabled:opacity-40 " +
        styles
      }
    >
      {children}
    </motion.button>
  );
}
