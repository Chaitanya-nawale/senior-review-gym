import { createFileRoute, Link, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Loader2,
  Menu,
  Flame,
  Snowflake,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { useStreak } from "../hooks/useStreak";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

/* ────────────────────────────────────────────────────────────── */
/*  TOP NAV                                                        */
/* ────────────────────────────────────────────────────────────── */

function DashboardNav() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const { data: streakData } = useStreak();
  const currentStreak = streakData?.current_streak ?? 0;
  const streakFreezes = streakData?.streak_freezes_available ?? 0;

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Developer";
  const initial = name.charAt(0).toUpperCase();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="group flex items-center gap-2">
            <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
            <span className="text-[15px] font-semibold tracking-tight text-white">MeisterUp</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/dashboard"
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
            activeProps={{ className: "text-[13px] font-medium text-white transition-colors" }}
          >
            Dashboard
          </Link>
          <Link
            to="/skills"
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
            activeProps={{ className: "text-[13px] font-medium text-white transition-colors" }}
          >
            Skills
          </Link>
          <Link
            to="/leaderboard"
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
            activeProps={{ className: "text-[13px] font-medium text-white transition-colors" }}
          >
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Streak Indicator */}
          {currentStreak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 px-2.5 py-1.5 text-[13px] font-medium text-orange-400">
              <Flame className="h-4 w-4" />
              <span>{currentStreak}</span>
            </div>
          )}

          {/* Streak Freeze Indicator */}
          {streakFreezes > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-sky-500/20 bg-sky-500/10 px-2.5 py-1.5 text-[13px] font-medium text-sky-400"
              title={`${streakFreezes} streak freeze${streakFreezes !== 1 ? 's' : ''} available`}
            >
              <Snowflake className="h-4 w-4" />
              <span>{streakFreezes}</span>
            </div>
          )}

          <button
            className="relative rounded-lg border border-white/10 bg-white/[0.03] p-2 text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_6px] shadow-indigo-400" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[13px] font-medium text-white/80 transition hover:bg-white/[0.06]"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-[10px] font-bold text-white uppercase">
                {initial}
              </div>
              <span className="hidden sm:block">{name}</span>
              <ChevronDown className="h-3 w-3 text-white/40" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#0e0e12]/95 p-1 shadow-xl backdrop-blur-xl"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <User className="h-3.5 w-3.5" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-white/70 transition hover:bg-white/[0.06] hover:text-white bg-transparent border-none text-left cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/[0.06] bg-black/95 px-6 py-4 overflow-hidden"
          >
            <nav className="flex flex-col gap-4">
              <Link
                to="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className="text-[14px] font-medium text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/skills"
                onClick={() => setMobileNavOpen(false)}
                className="text-[14px] font-medium text-white/50 transition-colors hover:text-white"
              >
                Skills
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setMobileNavOpen(false)}
                className="text-[14px] font-medium text-white/50 transition-colors hover:text-white"
              >
                Leaderboard
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-sans">
        {/* Fake Nav Skeleton */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <div className="h-5 w-24 animate-pulse rounded-md bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-16 animate-pulse rounded-lg bg-white/10" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </header>

        {/* Fake Page Content Skeleton */}
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-white/10 mb-8" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            </div>
            <div className="hidden lg:block space-y-4">
              <div className="h-64 animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <DashboardNav />
      <div className="pt-14 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
