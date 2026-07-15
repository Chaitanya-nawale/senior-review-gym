import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — MeisterUp" },
      {
        name: "description",
        content:
          "Sign in to MeisterUp — your AI-native adaptive learning platform for engineers.",
      },
      { property: "og:title", content: "Sign In — MeisterUp" },
      {
        property: "og:description",
        content:
          "Sign in to MeisterUp — your AI-native adaptive learning platform for engineers.",
      },
    ],
  }),
  component: SignInPage,
});

/* ─────────────────────────────────── helpers ─────────────────────────────── */

function cn(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ─────────────────────────────── background ──────────────────────────────── */

function GridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
      }}
    />
  );
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-[120px] opacity-40",
        className,
      )}
    />
  );
}

/* ─────────────────────────────────── nav ─────────────────────────────────── */

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/[0.06]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2">
          <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            MeisterUp
          </span>
          <span className="ml-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white/50">
            Beta
          </span>
        </Link>

        <p className="text-[13px] text-white/50">
          Don't have an account?{" "}
          <Link
            to="/"
            className="font-medium text-white hover:text-white/80 transition-colors"
          >
            Start free
          </Link>
        </p>
      </div>
    </header>
  );
}

/* ──────────────────────────────── form field ─────────────────────────────── */

function Field({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  children,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-white/70"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={id}
          className={cn(
            "w-full rounded-xl border bg-white/[0.04] px-4 py-2.5 text-[14px] text-white placeholder:text-white/30",
            "outline-none transition-all duration-200",
            "focus:bg-white/[0.06] focus:border-white/30 focus:ring-2 focus:ring-indigo-500/25",
            error ? "border-red-500/50" : "border-white/10",
          )}
        />
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[12px] text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────── divider ─────────────────────────────────── */

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-[12px] text-white/30">or continue with</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

/* ──────────────────────────────── main page ─────────────────────────────── */

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    // Simulate async auth — replace with real call
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 1500);
    return () => clearTimeout(timer);
  }, [submitted, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-sans">
      {/* Background */}
      <GridBg />
      <GlowOrb className="left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 bg-indigo-500" />
      <GlowOrb className="right-0 top-40 h-[320px] w-[320px] bg-fuchsia-500/40" />
      <GlowOrb className="left-0 top-60 h-[320px] w-[320px] bg-cyan-500/30" />

      <Nav />

      <main className="relative flex min-h-screen items-center justify-center px-4 pt-14">
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                <Sparkles className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  You're in.
                </h1>
                <p className="mt-1.5 text-[14px] text-white/50">
                  Welcome back — redirecting to your dashboard…
                </p>
              </div>
              <div className="h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, ease: "linear" }}
                  className="h-full rounded-full bg-indigo-400"
                />
              </div>
            </motion.div>
          ) : (
            /* ── sign-in card ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[400px]"
            >
              {/* eyebrow */}
              <div className="mb-7 flex flex-col items-center gap-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  <span>Welcome back</span>
                </div>
                <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white">
                  Sign in to MeisterUp
                </h1>
                <p className="text-[14px] text-white/50">
                  Continue your adaptive learning journey.
                </p>
              </div>

              {/* glass card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                {/* subtle inner glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                      if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                    }}
                    error={errors.email}
                  />

                  <Field
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(v) => {
                      setPassword(v);
                      if (errors.password)
                        setErrors((e) => ({ ...e, password: undefined }));
                    }}
                    error={errors.password}
                  >
                    <button
                      type="button"
                      id="toggle-password"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </Field>

                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="remember"
                      className="flex cursor-pointer items-center gap-2 text-[13px] text-white/50"
                    >
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-3.5 w-3.5 cursor-pointer accent-indigo-500"
                      />
                      Remember me
                    </label>
                    <a
                      href="#forgot"
                      className="text-[13px] text-white/50 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <motion.button
                    id="signin-submit"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className={cn(
                      "group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5",
                      "text-[14px] font-semibold text-black transition-all duration-200",
                      loading
                        ? "bg-white/70 cursor-not-allowed"
                        : "bg-white hover:bg-white/90 cursor-pointer",
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-5">
                  <Divider />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {/* GitHub OAuth placeholder */}
                  <button
                    id="signin-github"
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-white/70 transition-all hover:bg-white/[0.07] hover:text-white cursor-pointer"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </button>
                  {/* Google OAuth placeholder */}
                  <button
                    id="signin-google"
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-white/70 transition-all hover:bg-white/[0.07] hover:text-white cursor-pointer"
                  >
                    {/* Inline Google "G" mark */}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M21.35 11.1H12v3.63h5.35C16.7 16.6 14.58 18 12 18a6 6 0 1 1 0-12c1.53 0 2.92.57 3.97 1.5l2.57-2.57A9.94 9.94 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 9.71-4.06 9.71-10 0-.65-.07-1.29-.18-1.9H21.35Z" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>

              {/* Footer note */}
              <p className="mt-5 text-center text-[12px] text-white/30">
                By signing in, you agree to our{" "}
                <a href="#terms" className="underline hover:text-white/60 transition-colors">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#privacy" className="underline hover:text-white/60 transition-colors">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
