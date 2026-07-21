import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, HelpCircle } from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — MeisterUp" },
      {
        name: "description",
        content:
          "Simple, transparent pricing for engineers and teams. Learn one skill free forever, or upgrade for unlimited skills and AI tutoring.",
      },
      { property: "og:title", content: "Pricing — MeisterUp" },
      {
        property: "og:description",
        content:
          "Simple, transparent pricing for engineers and teams. Learn one skill free forever, or upgrade for unlimited skills and AI tutoring.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PricingPage,
});

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

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-[120px] opacity-40", className)}
    />
  );
}

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
        <Link to="/" className="group flex items-center gap-2">
          <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight text-white">MeisterUp</span>
          <span className="ml-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white/50">
            Beta
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-[13px] font-medium text-white/60 transition-colors hover:text-white">
            Home
          </Link>
          <Link to="/skills" className="text-[13px] font-medium text-white/60 transition-colors hover:text-white">
            Skills
          </Link>
          <Link to="/pricing" className="text-[13px] font-medium text-white transition-colors">
            Pricing
          </Link>
          <Link to="/faq" className="text-[13px] font-medium text-white/60 transition-colors hover:text-white">
            FAQ
          </Link>
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
              <Link
                to="/"
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-white/90"
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const PLANS = [
  {
    name: "Learner",
    price: "Free",
    tag: "Free Forever",
    body: "For self-directed engineers exploring one core skill track.",
    features: [
      "1 active skill track free forever",
      "Adaptive gap assessment",
      "Personalized learning path",
      "Daily review sessions",
      "Basic progress analytics",
    ],
    cta: "Start free",
    highlight: false,
    href: "/signin",
  },
  {
    name: "Pro",
    price: "$18",
    per: "/mo",
    tag: "Most popular",
    body: "For ambitious engineers mastering multiple complex domains.",
    features: [
      "Unlimited active skill tracks",
      "All 8 activity & review types",
      "AI tutor & instant explain-back",
      "Spaced repetition engine",
      "Concept heatmap & velocity analytics",
      "Priority curriculum updates",
    ],
    cta: "Start 14-day trial",
    highlight: true,
    href: "/signin",
  },
  {
    name: "Team",
    price: "$32",
    per: "/seat/mo",
    tag: "For teams",
    body: "For engineering teams leveling up together with shared skill maps.",
    features: [
      "Everything in Pro",
      "Shared team skill matrices",
      "Manager progress dashboard",
      "Custom skill track authoring",
      "SAML / SSO & SCIM provisioning",
      "Dedicated success manager",
    ],
    cta: "Contact sales",
    highlight: false,
    href: "mailto:sales@meisterup.com",
  },
];

function PricingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white antialiased">
      <Nav />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-36 pb-20">
        <GlowOrb className="left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 bg-indigo-500/30" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Eyebrow>Transparent Pricing</Eyebrow>
          <h1 className="mt-6 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">
            Invest in your engineering leverage.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/60">
            Start with one skill free forever. Upgrade to Pro or Team when you're ready to accelerate your entire career repertoire.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8 transition-all duration-200",
                  p.highlight
                    ? "border-white/30 bg-gradient-to-b from-white/[0.1] to-white/[0.02] shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                    : "border-white/10 bg-white/[0.02]",
                )}
              >
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-black">
                    {p.tag}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-white/70">{p.name}</span>
                  {!p.highlight && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">{p.price}</span>
                  {p.per && <span className="text-[13px] text-white/50">{p.per}</span>}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-white/60">{p.body}</p>

                <div className="my-6 border-t border-white/[0.08]" />

                <ul className="flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/80">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={p.href}
                  className={cn(
                    "mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-[13px] font-semibold transition-all",
                    p.highlight
                      ? "bg-white text-black hover:bg-white/90 shadow-sm"
                      : "border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]",
                  )}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-8 text-center sm:p-10 backdrop-blur">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-sans text-lg font-semibold text-white sm:text-xl">
              Have questions about plans or billing?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
              Our team is here to help clarify plan details, enterprise seating, or custom learning needs.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/[0.08]"
              >
                Check our FAQ
              </Link>
              <a
                href="mailto:sales@meisterup.com"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90"
              >
                Contact our team
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-black py-8 text-[13px] text-white/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.ico" alt="MeisterUp Logo" className="h-5 w-5 object-contain" />
              <span className="font-semibold tracking-tight text-white">MeisterUp</span>
            </Link>
            <span className="text-white/20">•</span>
            <span className="text-[12px] text-white/40">© {new Date().getFullYear()} MeisterUp, Inc.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[12px]">
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
            <div className="flex items-center gap-1.5 pl-2 text-white/40">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400" />
              <span>Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
