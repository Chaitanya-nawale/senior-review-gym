import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { motion } from "framer-motion";
import {
  Brain,
  Check,
  Flame,
  Link2,
  Loader2,
  Medal,
  Sparkles,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useUserProfile } from "../hooks/useProfile";
import { useStreak } from "../hooks/useStreak";
import { useDashboardStats } from "../hooks/useDashboard";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MeisterUp" },
      { name: "description", content: "Your engineer profile and stats." },
    ],
  }),
  component: ProfilePage,
});

/* ── Icon map for badge_icon field ── */
const BADGE_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Star,
  Medal,
  Check,
  Brain,
  TrendingUp,
  Link2,
};
function BadgeIcon({ name }: { name: string | null }) {
  const Icon = (name && BADGE_ICONS[name]) ? BADGE_ICONS[name] : Medal;
  return <Icon className="h-6 w-6" />;
}

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: streakData } = useStreak();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const name =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Developer";
  const email = user?.email || "";
  const avatar = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null;
  const initial = name.charAt(0).toUpperCase();
  const currentStreak = streakData?.current_streak ?? 0;

  const isLoading = profileLoading || statsLoading;

  /* Role badge display */
  const ROLE_LABELS: Record<string, string> = {
    frontend: "Frontend Engineer",
    backend: "Backend Engineer",
    fullstack: "Fullstack Engineer",
    devops: "DevOps / SRE",
    data: "Data / ML Engineer",
    tech_lead: "Tech Lead",
  };
  const roleLabel = profile?.role ? (ROLE_LABELS[profile.role] ?? profile.role) : "Engineer";

  /* Stat cards */
  const statCards = [
    {
      label: "Total XP",
      value: isLoading ? "—" : (stats?.totalXP ?? 0).toLocaleString(),
      icon: TrendingUp,
      color: "text-indigo-400",
    },
    {
      label: "Concepts Mastered",
      value: isLoading ? "—" : String(stats?.conceptsMastered ?? 0),
      icon: Brain,
      color: "text-fuchsia-400",
    },
    {
      label: "Current Streak",
      value: isLoading ? "—" : `${currentStreak}d`,
      icon: Flame,
      color: "text-amber-400",
    },
    {
      label: "Avg Mastery",
      value: isLoading ? "—" : `${stats?.masteryPct ?? 0}%`,
      icon: Star,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-3xl font-bold text-white uppercase shadow-lg overflow-hidden">
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
          {profile?.bio && (
            <p className="mt-2 text-[14px] text-white/60 max-w-md">{profile.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {roleLabel}
            </div>
            {currentStreak > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[12px] font-medium text-indigo-300">
                <Flame className="h-3.5 w-3.5" />
                {currentStreak} Day Streak
              </div>
            )}
            {profile?.experience_band && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-white/50">
                {profile.experience_band}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
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
                <div className={cn("rounded-lg bg-white/[0.04] p-2", stat.color)}>
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
        {/* Active Skills */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-medium text-white">Skill Progress</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />
              ))}
            </div>
          ) : (stats?.masteryPct ?? 0) > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-white">Overall Mastery</span>
                <span className="text-[13px] font-semibold text-white/80">
                  {stats?.masteryPct ?? 0}%
                </span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.masteryPct ?? 0}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-indigo-500"
                />
              </div>
              <div className="mt-3 text-[12px] text-white/40">
                {stats?.conceptsMastered ?? 0} / {stats?.totalConcepts ?? 0} concepts mastered
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <User className="mx-auto h-8 w-8 text-white/20" />
              <p className="mt-3 text-[13px] text-white/40">
                Start a skill to track progress here.
              </p>
            </div>
          )}
        </div>

        {/* Achievements placeholder — shows loading or an informational card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium text-white">Achievements</h3>
            {!isLoading && (
              <span className="text-[13px] text-white/40">
                {stats?.conceptsMastered ?? 0} concepts mastered
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-24 animate-pulse rounded-xl border border-white/5 bg-white/[0.01]"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Static achievement milestones based on real stats */}
              {[
                {
                  name: "First Step",
                  desc: "Completed first session",
                  icon: Sparkles,
                  color: "text-blue-400",
                  unlocked: (stats?.conceptsMastered ?? 0) > 0,
                },
                {
                  name: "On Fire",
                  desc: "7+ day streak",
                  icon: Flame,
                  color: "text-amber-400",
                  unlocked: currentStreak >= 7,
                },
                {
                  name: "Architect",
                  desc: "50 concepts mastered",
                  icon: Star,
                  color: "text-fuchsia-400",
                  unlocked: (stats?.conceptsMastered ?? 0) >= 50,
                },
                {
                  name: "Centurion",
                  desc: "1,000+ total XP",
                  icon: TrendingUp,
                  color: "text-emerald-400",
                  unlocked: (stats?.totalXP ?? 0) >= 1000,
                },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.name}
                    className={cn(
                      "flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.01] p-4 text-center transition",
                      badge.unlocked ? "opacity-100" : "opacity-30",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]",
                        badge.color,
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-[13px] font-medium text-white">{badge.name}</div>
                    <div className="mt-1 text-[11px] text-white/40">{badge.desc}</div>
                    {badge.unlocked && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                        <Check className="h-3 w-3" /> Earned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
