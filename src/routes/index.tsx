import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  Brain,
  Network,
  Sparkles,
  LineChart,
  Repeat,
  Compass,
  Github,
  Twitter,
} from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

/* ----------------------------- Design tokens ----------------------------- */
// Single accent color used across the page. Everything else is neutral.
const ACCENT = "#7C5CFF";
const ACCENT_SOFT = "rgba(124, 92, 255, 0.14)";

/* --------------------------------- Page --------------------------------- */
function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08080A] text-neutral-200 font-sans antialiased selection:bg-[color:var(--accent-soft)] selection:text-white"
      style={{ ["--accent" as any]: ACCENT, ["--accent-soft" as any]: ACCENT_SOFT }}
    >
      <BackgroundGrid />
      <Nav />
      <main className="relative">
        <Hero />
        <SocialProof />
        <Comparison />
        <HowItWorks />
        <Features />
        <ProductPreview />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------ Background ------------------------------ */
function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(124,92,255,0.10), transparent 60%), radial-gradient(800px 500px at 90% 110%, rgba(124,92,255,0.05), transparent 60%)",
      }}
    />
  );
}

/* --------------------------------- Nav ---------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-[#08080A]/70 border-b border-white/[0.06]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            MeisterUp
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-[13.5px] text-neutral-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how" className="text-[13.5px] text-neutral-400 hover:text-white transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-[13.5px] text-neutral-400 hover:text-white transition-colors">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/signin"
            className="hidden text-[13.5px] text-neutral-300 hover:text-white transition-colors md:inline-flex px-3 py-1.5"
          >
            Sign in
          </Link>
          <GetStartedButton />
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <div
      className="grid h-7 w-7 place-items-center rounded-md"
      style={{
        background: "linear-gradient(135deg, #7C5CFF 0%, #4B33B5 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset",
      }}
    >
      <div className="h-2 w-2 rounded-sm bg-white/95" />
    </div>
  );
}

function GetStartedButton() {
  const { user } = useAuth();
  return (
    <Link
      to={user ? "/dashboard" : "/signin"}
      className="group inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-1.5 text-[13px] font-medium text-black transition-all hover:bg-neutral-200"
    >
      Get started
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* --------------------------------- Hero --------------------------------- */
function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <a
          href="#how"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[12px] text-neutral-300 backdrop-blur-sm transition-colors hover:border-white/[0.14]"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
          />
          Now in private beta
          <ArrowRight className="h-3 w-3 text-neutral-500" />
        </a>

        <h1 className="text-balance text-[44px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[56px] md:text-[68px]">
          The shortest path
          <br />
          to mastery.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-[16px] leading-relaxed text-neutral-400 sm:text-[17px]">
          MeisterUp learns what you already know, finds the gaps that matter,
          and teaches the next concept — one at a time. A personal curriculum
          for any technical skill.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to={user ? "/dashboard" : "/signin"}
            className="group inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[14px] font-medium text-black transition-all hover:bg-neutral-200"
          >
            Start learning free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.02] px-4 py-2.5 text-[14px] font-medium text-neutral-200 transition-colors hover:bg-white/[0.05]"
          >
            See how it works
          </a>
        </div>

        <p className="mt-5 text-[12.5px] text-neutral-500">
          Free forever plan. No credit card required.
        </p>
      </motion.div>

      {/* Product mockup */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-20 max-w-5xl"
      >
        <div
          aria-hidden
          className="absolute -inset-x-16 -top-10 -bottom-10 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(600px 300px at 50% 50%, rgba(124,92,255,0.18), transparent 70%)",
          }}
        />
        <MockDashboard />
      </motion.div>
    </section>
  );
}

/* ---------------------------- Product Mockup ---------------------------- */
function MockDashboard() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0C0C10] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <div className="mx-auto text-[11px] font-mono text-neutral-500">
          meisterup.app / learn / systems-design
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Sidebar */}
        <aside className="col-span-3 border-r border-white/[0.06] bg-[#0A0A0D] p-4">
          <div className="mb-4 text-[10.5px] font-medium uppercase tracking-wider text-neutral-500">
            Your path
          </div>
          <ul className="space-y-1 text-[12.5px]">
            {[
              { label: "Load balancing", state: "done" },
              { label: "Caching layers", state: "done" },
              { label: "CAP theorem", state: "active" },
              { label: "Consistent hashing", state: "next" },
              { label: "Message queues", state: "later" },
              { label: "Sharding strategies", state: "later" },
            ].map((n) => (
              <li
                key={n.label}
                className={[
                  "flex items-center gap-2 rounded-md px-2 py-1.5",
                  n.state === "active" ? "bg-white/[0.04] text-white" : "text-neutral-400",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-4 w-4 place-items-center rounded-full border text-[9px]",
                    n.state === "done"
                      ? "border-transparent bg-white/90 text-black"
                      : n.state === "active"
                        ? "border-[color:var(--accent)]"
                        : "border-white/10",
                  ].join(" ")}
                  style={n.state === "active" ? { background: ACCENT_SOFT } : undefined}
                >
                  {n.state === "done" ? <Check className="h-2.5 w-2.5" /> : null}
                </span>
                <span className="truncate">{n.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="col-span-9 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono text-neutral-500">Concept 03 / 24</div>
              <h3 className="mt-1 text-[20px] font-semibold text-white">
                CAP theorem in practice
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] text-neutral-400">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENT }}
              />
              Adapting to your progress
            </div>
          </div>

          <MockGraph />

          <div className="mt-5 grid grid-cols-3 gap-3">
            <MockStat label="Mastery" value="72%" hint="+8% this week" />
            <MockStat label="Concepts learned" value="46" hint="of 214" />
            <MockStat label="Streak" value="12 days" hint="Consistent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-3">
      <div className="text-[10.5px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-1 text-[18px] font-semibold text-white">{value}</div>
      <div className="text-[11px] text-neutral-500">{hint}</div>
    </div>
  );
}

function MockGraph() {
  // Small SVG knowledge-graph illustration
  const nodes = [
    { id: "a", x: 80, y: 60, l: "Consistency", state: "done" },
    { id: "b", x: 200, y: 40, l: "Availability", state: "done" },
    { id: "c", x: 320, y: 80, l: "Partition tolerance", state: "active" },
    { id: "d", x: 140, y: 150, l: "Quorum reads", state: "next" },
    { id: "e", x: 300, y: 170, l: "Eventual consistency", state: "later" },
    { id: "f", x: 440, y: 130, l: "Consensus", state: "later" },
  ];
  const edges: [string, string][] = [
    ["a", "c"],
    ["b", "c"],
    ["a", "d"],
    ["c", "d"],
    ["c", "e"],
    ["c", "f"],
    ["e", "f"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const color = (s: string) =>
    s === "done" ? "#E5E5E5" : s === "active" ? ACCENT : s === "next" ? "rgba(124,92,255,0.55)" : "rgba(255,255,255,0.16)";

  return (
    <div className="mt-6 rounded-lg border border-white/[0.06] bg-[#0A0A0D] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-mono text-neutral-500">
          knowledge_graph.svg
        </div>
        <div className="flex items-center gap-3 text-[10.5px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/90" /> Mastered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} /> Learning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" /> Ahead
          </span>
        </div>
      </div>
      <svg viewBox="0 0 520 220" className="w-full">
        {edges.map(([a, b], i) => {
          const na = byId[a];
          const nb = byId[b];
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.state === "active" ? 7 : 5}
              fill={color(n.state)}
              opacity={n.state === "later" ? 0.6 : 1}
            />
            {n.state === "active" && (
              <circle
                cx={n.x}
                cy={n.y}
                r={14}
                fill="none"
                stroke={ACCENT}
                strokeOpacity="0.35"
              />
            )}
            <text
              x={n.x + 12}
              y={n.y + 3}
              fontSize="10"
              fill={n.state === "later" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.7)"}
              fontFamily="Inter, sans-serif"
            >
              {n.l}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------ Social proof ---------------------------- */
function SocialProof() {
  const logos = ["Vercel", "Linear", "Stripe", "Ramp", "Notion", "Anthropic"];
  return (
    <section className="relative z-10 border-y border-white/[0.05] bg-white/[0.01]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10">
        <div className="text-[11.5px] uppercase tracking-[0.14em] text-neutral-500">
          Trusted by engineers from
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((l) => (
            <span
              key={l}
              className="text-[15px] font-medium tracking-tight text-neutral-500/80 grayscale transition-colors hover:text-neutral-300"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Comparison ------------------------------ */
function Comparison() {
  return (
    <Section id="why" eyebrow="Why MeisterUp" title="Fixed courses waste your time.">
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        <CompareCard
          title="Traditional courses"
          tone="muted"
          items={[
            "Everyone follows the same fixed curriculum",
            "You re-learn things you already know",
            "Gaps stay hidden until you fail",
            "Progress is measured by videos watched",
          ]}
        />
        <CompareCard
          title="MeisterUp"
          tone="accent"
          items={[
            "A path built around what you already know",
            "Skips concepts you've proven you understand",
            "Surfaces gaps the moment they appear",
            "Progress is measured by demonstrated mastery",
          ]}
        />
      </div>
    </Section>
  );
}

function CompareCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "muted" | "accent";
}) {
  const accent = tone === "accent";
  return (
    <div
      className={[
        "rounded-xl border p-6",
        accent
          ? "border-white/[0.1] bg-white/[0.02]"
          : "border-white/[0.05] bg-transparent",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {accent && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
          />
        )}
        <h3 className={accent ? "text-white" : "text-neutral-400"}>{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3">
            <span
              className={[
                "mt-1.5 h-1.5 w-1.5 flex-none rounded-full",
                accent ? "" : "bg-neutral-700",
              ].join(" ")}
              style={accent ? { background: ACCENT } : undefined}
            />
            <span
              className={[
                "text-[14.5px] leading-relaxed",
                accent ? "text-neutral-200" : "text-neutral-500",
              ].join(" ")}
            >
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------- How it works ----------------------------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Assess",
      body:
        "A short adaptive assessment maps what you already know, so nothing gets in your way that you've already mastered.",
    },
    {
      n: "02",
      title: "Personalize",
      body:
        "MeisterUp builds a knowledge graph of the skill and threads a path through it — from your current edge to your goal.",
    },
    {
      n: "03",
      title: "Master",
      body:
        "Learn one concept at a time. Spaced repetition and targeted challenges lock it in without busywork.",
    },
  ];
  return (
    <Section id="how" eyebrow="How it works" title="One concept at a time. The right one.">
      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.05] md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="bg-[#08080A] p-8">
            <div className="font-mono text-[11.5px] tracking-wider text-neutral-500">
              {s.n}
            </div>
            <h3 className="mt-4 text-[19px] font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-400">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------- Features ------------------------------ */
function Features() {
  const items = [
    {
      icon: Compass,
      title: "Adaptive assessments",
      body: "Short, precise assessments that pinpoint what you know and where you're stuck.",
    },
    {
      icon: Sparkles,
      title: "Personalized curriculum",
      body: "A learning path built for you, updated after every session as your knowledge grows.",
    },
    {
      icon: Network,
      title: "Knowledge graph",
      body: "Every skill is modeled as a graph of connected concepts, so learning follows real structure.",
    },
    {
      icon: Brain,
      title: "AI tutor",
      body: "Ask questions in plain language. Get explanations grounded in what you already understand.",
    },
    {
      icon: LineChart,
      title: "Progress analytics",
      body: "See mastery by concept, not videos watched. Know exactly what to work on next.",
    },
    {
      icon: Repeat,
      title: "Spaced repetition",
      body: "The concepts you're forgetting come back on the right day, automatically.",
    },
  ];
  return (
    <Section id="features" eyebrow="Features" title="Built for how you actually learn.">
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="group rounded-xl border border-white/[0.06] p-6 transition-colors hover:border-white/[0.12]">
            <div
              className="grid h-9 w-9 place-items-center rounded-md border border-white/[0.08] bg-white/[0.02] text-neutral-300 transition-colors group-hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="mt-5 text-[15.5px] font-medium text-white">{title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-400">
              {body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------- Product Preview ---------------------------- */
function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <Section id="preview" eyebrow="Inside the product" title="See your mastery, not your minutes.">
      <div
        ref={ref}
        className="mt-14 grid gap-6 lg:grid-cols-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 rounded-xl border border-white/[0.06] bg-[#0C0C10] p-6"
        >
          <div className="text-[11px] uppercase tracking-wider text-neutral-500">Mastery map</div>
          <MasteryHeatmap />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#0C0C10] p-6"
        >
          <div className="text-[11px] uppercase tracking-wider text-neutral-500">
            Recommended next
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { t: "Quorum-based replication", w: "Weakness detected" },
              { t: "Bloom filters", w: "Prerequisite for LSM trees" },
              { t: "Backpressure in queues", w: "Adjacent to your last session" },
            ].map((r) => (
              <li key={r.t} className="rounded-lg border border-white/[0.05] p-3">
                <div className="text-[13.5px] font-medium text-white">{r.t}</div>
                <div className="mt-0.5 text-[12px] text-neutral-500">{r.w}</div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}

function MasteryHeatmap() {
  // 7 rows x 24 cols
  const cells = Array.from({ length: 7 * 24 }, (_, i) => {
    // deterministic pseudo random
    const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    return v;
  });
  return (
    <div className="mt-4 grid grid-cols-24 gap-[3px]" style={{ gridTemplateColumns: "repeat(24, minmax(0,1fr))" }}>
      {cells.map((v, i) => {
        const alpha = v < 0.35 ? 0.06 : v < 0.6 ? 0.18 : v < 0.85 ? 0.5 : 0.95;
        return (
          <div
            key={i}
            className="aspect-square rounded-[3px]"
            style={{
              background:
                alpha < 0.2
                  ? "rgba(255,255,255,0.05)"
                  : `rgba(124,92,255,${alpha})`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------- Final CTA ------------------------------ */
function FinalCta() {
  const { user } = useAuth();
  return (
    <section id="pricing" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[48px]">
          Learn the next thing.
          <br />
          Not everything.
        </h2>
        <p className="mt-5 text-[15.5px] leading-relaxed text-neutral-400">
          Free forever. Upgrade when you're ready for more skills and deeper analytics.
        </p>
        <div className="mt-8">
          <Link
            to={user ? "/dashboard" : "/signin"}
            className="group inline-flex items-center gap-1.5 rounded-md bg-white px-5 py-2.5 text-[14px] font-medium text-black transition-all hover:bg-neutral-200"
          >
            Get started — it's free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Footer -------------------------------- */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-[13.5px] font-medium text-neutral-300">MeisterUp</span>
          <span className="ml-2 text-[12.5px] text-neutral-600">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[13px] text-neutral-500">
          <a href="#features" className="hover:text-neutral-200 transition-colors">Features</a>
          <a href="#how" className="hover:text-neutral-200 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-neutral-200 transition-colors">Pricing</a>
          <a href="https://github.com" aria-label="GitHub" className="hover:text-neutral-200 transition-colors">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" className="hover:text-neutral-200 transition-colors">
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ Section shell --------------------------- */
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-neutral-500">
          {eyebrow}
        </div>
        <h2 className="mt-3 text-balance text-[32px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[40px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}