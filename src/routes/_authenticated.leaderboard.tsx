import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, TrendingUp, ShieldCheck, Search, Check } from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — MeisterUp" },
      { name: "description", content: "Compete with other engineers." },
    ],
  }),
  component: LeaderboardPage,
});

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// MOCK DATA for now
const LEADERBOARD_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: `usr-${i}`,
  rank: i + 1,
  name: i === 7 ? "You" : `Engineer ${i + 1}`,
  avatar: `https://i.pravatar.cc/150?u=${i}`,
  xp: 15000 - i * 150 - Math.floor(Math.random() * 50),
  streak: Math.max(0, 30 - i - Math.floor(Math.random() * 5)),
  isCurrentUser: i === 7,
}));

function LeaderboardPage() {
  const { user } = useAuth();
  const [optedIn, setOptedIn] = useState(true);

  const currentUserData = LEADERBOARD_DATA.find((u) => u.isCurrentUser);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 backdrop-blur">
            <Trophy className="h-3 w-3 text-amber-400" />
            <span>Global Rankings</span>
          </div>
          <h1 className="mt-4 font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Weekly Leaderboard
          </h1>
          <p className="mt-2 text-[15px] text-white/50">
            Compare your learning velocity against the community. Resets every Sunday.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-white/60">Privacy Status</span>
            <span className="text-[13px] text-white">
              {optedIn ? "Visible on Leaderboard" : "Hidden from Leaderboard"}
            </span>
          </div>
          <button
            onClick={() => setOptedIn(!optedIn)}
            className={cn(
              "relative h-6 w-10 rounded-full transition-colors",
              optedIn ? "bg-indigo-500" : "bg-white/10",
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                optedIn ? "left-5" : "left-1",
              )}
            />
          </button>
        </motion.div>
      </div>

      {!optedIn ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-white/20" />
          <h3 className="mt-4 text-lg font-medium text-white">Your profile is hidden</h3>
          <p className="mt-2 text-[14px] text-white/50">
            You must opt-in to participate in the global leaderboard.
          </p>
          <button
            onClick={() => setOptedIn(true)}
            className="mt-6 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-white/90"
          >
            Join Leaderboard
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-white/10 bg-[#0e0e12]">
            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
              <Search className="h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search engineers..."
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            <div className="divide-y divide-white/[0.04]">
              <div className="grid grid-cols-[60px_1fr_100px_100px] items-center px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
                <div className="text-center">Rank</div>
                <div>Engineer</div>
                <div className="hidden sm:block text-right">Streak</div>
                <div className="text-right">XP</div>
              </div>

              {LEADERBOARD_DATA.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className={cn(
                    "grid grid-cols-[60px_1fr_100px_100px] items-center px-6 py-4 transition hover:bg-white/[0.02]",
                    row.isCurrentUser && "bg-indigo-500/[0.08] hover:bg-indigo-500/[0.12]",
                  )}
                >
                  <div className="text-center">
                    {row.rank === 1 ? (
                      <Medal className="mx-auto h-5 w-5 text-yellow-400" />
                    ) : row.rank === 2 ? (
                      <Medal className="mx-auto h-5 w-5 text-gray-300" />
                    ) : row.rank === 3 ? (
                      <Medal className="mx-auto h-5 w-5 text-amber-700" />
                    ) : (
                      <span className="text-[14px] font-semibold text-white/40">{row.rank}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={row.avatar} alt="" className="h-8 w-8 rounded-full bg-white/10" />
                    <span
                      className={cn(
                        "text-[14px] font-medium",
                        row.isCurrentUser ? "text-indigo-300" : "text-white",
                      )}
                    >
                      {row.name}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center justify-end gap-1.5">
                    <Flame
                      className={cn(
                        "h-3.5 w-3.5",
                        row.streak > 3 ? "text-amber-400" : "text-white/20",
                      )}
                    />
                    <span className="text-[14px] font-medium text-white/80">{row.streak}</span>
                  </div>
                  <div className="text-right text-[14px] font-semibold text-white">
                    {row.xp.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {currentUserData && (
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.05] to-fuchsia-500/[0.05] p-6">
                <div className="text-[12px] font-medium text-white/50">Your Current Rank</div>
                <div className="mt-2 text-4xl font-semibold tracking-tight text-white">
                  #{currentUserData.rank}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="text-[12px] text-white/50">Points to Next Rank</div>
                  <div className="text-[13px] font-semibold text-indigo-400">120 XP</div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-[14px] font-medium text-white">How it works</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex gap-2 text-[13px] text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Earn XP by answering practice cards correctly.
                </li>
                <li className="flex gap-2 text-[13px] text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Maintain a daily streak to activate XP multipliers.
                </li>
                <li className="flex gap-2 text-[13px] text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Ranks reset every Sunday at midnight UTC.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
