import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../lib/auth";
import { ArrowRight, Loader2, Code2, Brain, Sparkles, Layers } from "lucide-react";
import { updateUserProfile } from "../lib/api";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import type { UserRole, ExperienceBand } from "../lib/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Assessment — MeisterUp" }],
  }),
  component: OnboardingPage,
});

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const ROLES: { label: string; value: UserRole }[] = [
  { label: "Frontend Engineer", value: "frontend" },
  { label: "Backend Engineer", value: "backend" },
  { label: "Fullstack Engineer", value: "fullstack" },
  { label: "DevOps / SRE", value: "devops" },
  { label: "Data / ML Engineer", value: "data" },
  { label: "Tech Lead / Manager", value: "tech_lead" },
];

const EXP_BANDS: { id: ExperienceBand; label: string; desc: string }[] = [
  { id: "0-2y", label: "0–2 years", desc: "Just starting out" },
  { id: "2-5y", label: "2–5 years", desc: "Building core expertise" },
  { id: "5-10y", label: "5–10 years", desc: "Architecting systems" },
  { id: "10y+", label: "10+ years", desc: "Seen it all" },
];

function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole | "">("");
  const [exp, setExp] = useState<ExperienceBand | "">("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  const handleComplete = async () => {
    if (!user || !role || !exp) return;
    setGenerating(true);
    try {
      // 1. Save profile with role and experience
      await updateUserProfile(user.id, {
        role: role as UserRole,
        experience_band: exp as ExperienceBand,
        onboarding_completed_at: new Date().toISOString(),
      });
      // 2. Seed initial streak row
      await supabase.from("user_streaks").upsert(
        { user_id: user.id, current_streak: 0, longest_streak: 0 },
        { onConflict: "user_id", ignoreDuplicates: true },
      );
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Onboarding save failed:", err);
      toast.error("Failed to save your profile. Please try again.");
      setGenerating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black font-sans text-white selection:bg-indigo-500/30">
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500 opacity-[0.05] blur-[120px]"
      />

      <header className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight">MeisterUp</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
                  <Brain className="h-8 w-8 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Let's calibrate your engine.
                </h1>
                <p className="mt-4 text-[16px] leading-relaxed text-white/50">
                  MeisterUp builds a unique curriculum based on what you already know. We'll start
                  with a few questions to set a baseline.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-white/90"
                >
                  Start calibration
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-semibold tracking-tight">What's your primary role?</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 text-left transition",
                        role === r.value
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]",
                      )}
                    >
                      <span className="text-[14px] font-medium text-white">{r.label}</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          role === r.value ? "border-indigo-500" : "border-white/20",
                        )}
                      >
                        {role === r.value && <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!role}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 disabled:hover:bg-white"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-semibold tracking-tight">Years of experience?</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {EXP_BANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setExp(b.id)}
                      className={cn(
                        "flex flex-col rounded-xl border p-4 text-left transition",
                        exp === b.id
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]",
                      )}
                    >
                      <span className="text-[15px] font-medium text-white">{b.label}</span>
                      <span className="mt-1 text-[13px] text-white/50">{b.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[14px] font-medium text-white/50 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!exp || generating}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 disabled:hover:bg-white"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating curriculum...
                      </>
                    ) : (
                      "Generate curriculum"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-white/5">
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 2) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
