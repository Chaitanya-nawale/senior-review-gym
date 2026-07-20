import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { motion } from "framer-motion";
import { User, Medal, Flame, TrendingUp, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MeisterUp" },
      { name: "description", content: "Your engineer profile and stats." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Developer";
  const email = user?.email || "";
  const avatar = user?.user_metadata?.avatar_url || null;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-3xl font-bold text-white uppercase shadow-lg">
          {avatar ? (
            <img src={avatar} alt={name} className="h-full w-full rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div>
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {name}
          </h1>
          <p className="mt-1 text-[15px] text-white/50">{email}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Senior Engineer
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[12px] font-medium text-indigo-300">
              <Flame className="h-3.5 w-3.5" />7 Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total XP", value: "14,250", icon: TrendingUp, color: "text-indigo-400" },
          { label: "Concepts Mastered", value: "48", icon: Brain, color: "text-fuchsia-400" },
          { label: "Cards Correct", value: "852", icon: Check, color: "text-emerald-400" },
          { label: "Badges Earned", value: "12", icon: Medal, color: "text-amber-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg bg-white/[0.04] p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-[13px] font-medium text-white/50">{stat.label}</div>
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {stat.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Badges showcase */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium text-white">Earned Badges</h3>
            <span className="text-[13px] text-white/40">12 total</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                name: "First Blood",
                desc: "First card correct",
                icon: Sparkles,
                color: "text-blue-400",
              },
              {
                name: "Weekly Warrior",
                desc: "7 day streak",
                icon: Flame,
                color: "text-amber-400",
              },
              {
                name: "Architect",
                desc: "50 concepts mastered",
                icon: Star,
                color: "text-fuchsia-400",
              },
              {
                name: "Code Reviewer",
                desc: "500 cards correct",
                icon: Check,
                color: "text-emerald-400",
              },
            ].map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.01] p-4 text-center"
                >
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] ${badge.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-[13px] font-medium text-white">{badge.name}</div>
                  <div className="mt-1 text-[11px] text-white/40">{badge.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill progress */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-medium text-white">Active Skills</h3>
          {[
            { name: "Python", progress: 68 },
            { name: "TypeScript", progress: 42 },
            { name: "System Design", progress: 15 },
          ].map((skill) => (
            <div
              key={skill.name}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-white">{skill.name}</span>
                <span className="text-[13px] font-semibold text-white/80">{skill.progress}%</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Needed because Brain was removed from lucide imports in Dashboard earlier, but is used here.
function Brain(props: import("react").SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    </svg>
  );
}

// Check
function Check(props: import("react").SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
