import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../lib/auth";
import { Settings, User, Bell, Shield, LogOut, Loader2, Check } from "lucide-react";
import { useUserProfile, useUpdateProfile, useNotificationPrefs, useUpdateNotificationPrefs } from "../hooks/useProfile";
import { cn } from "../lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{ title: "Settings — MeisterUp" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");

  /* ── Profile data ── */
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { mutate: updateProfile, isPending: profileSaving } = useUpdateProfile();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  /* Sync form once profile loads */
  useEffect(() => {
    if (profile) {
      setDisplayName(
        profile.display_name ||
          user?.user_metadata?.full_name ||
          user?.email?.split("@")[0] ||
          "",
      );
      setBio(profile.bio ?? "");
    }
  }, [profile, user]);

  const handleSaveProfile = () => {
    if (!user) return;
    updateProfile(
      { display_name: displayName.trim(), bio: bio.trim() },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  /* ── Notification prefs ── */
  const { data: notifPrefs, isLoading: notifLoading } = useNotificationPrefs();
  const { mutate: updateNotifPrefs, isPending: notifSaving } = useUpdateNotificationPrefs();

  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [streakDanger, setStreakDanger] = useState(true);

  useEffect(() => {
    if (notifPrefs) {
      setDailyReminder(notifPrefs.daily_reminder ?? true);
      setWeeklySummary(notifPrefs.weekly_summary ?? true);
      setStreakDanger(notifPrefs.streak_danger_alert ?? true);
    }
  }, [notifPrefs]);

  const handleSaveNotifications = () => {
    updateNotifPrefs(
      {
        daily_reminder: dailyReminder,
        weekly_summary: weeklySummary,
        streak_danger_alert: streakDanger,
      },
      {
        onSuccess: () => toast.success("Preferences saved"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  /* ── Sign out ── */
  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const tabClass = (tab: typeof activeTab) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition",
      activeTab === tab
        ? "bg-white/[0.06] text-white"
        : "text-white/50 hover:bg-white/[0.03] hover:text-white",
    );

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-10">
      <div className="mb-10">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-[15px] text-white/50">
          Manage your account, preferences, and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:gap-10">
        <aside className="w-full shrink-0 md:w-64">
          <nav className="flex space-x-2 overflow-x-auto border-b border-white/10 pb-4 md:flex-col md:space-x-0 md:space-y-1 md:border-b-0 md:border-r md:pr-6 md:pb-0">
            <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
              <User className="h-4 w-4" />
              Profile details
            </button>
            <button onClick={() => setActiveTab("notifications")} className={tabClass("notifications")}>
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button onClick={() => setActiveTab("security")} className={tabClass("security")}>
              <Shield className="h-4 w-4" />
              Security
            </button>
            <div className="my-4 hidden h-px bg-white/10 md:block" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-rose-400 transition hover:bg-rose-400/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </aside>

        <div className="mt-8 flex-1 md:mt-0">
          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white">Public Profile</h3>
                <p className="mt-1 text-[14px] text-white/50">
                  This information will be displayed on your public profile and leaderboard.
                </p>
              </div>

              {profileLoading ? (
                <div className="flex items-center gap-2 text-[14px] text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading profile...
                </div>
              ) : (
                <div className="grid gap-6">
                  <div>
                    <label className="block text-[13px] font-medium text-white/70">
                      Display Name
                    </label>
                    <input
                      id="settings-display-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-2 block w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-white/70">Bio</label>
                    <textarea
                      id="settings-bio"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a little about yourself"
                      className="mt-2 block w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <button
                id="settings-save-profile"
                onClick={handleSaveProfile}
                disabled={profileSaving || profileLoading}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
                <p className="mt-1 text-[14px] text-white/50">
                  Choose what we can send you. We only send high-signal emails.
                </p>
              </div>

              {notifLoading ? (
                <div className="flex items-center gap-2 text-[14px] text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading preferences...
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      key: "daily" as const,
                      title: "Daily Practice Reminder",
                      desc: "A short reminder to keep your streak alive.",
                      value: dailyReminder,
                      set: setDailyReminder,
                    },
                    {
                      key: "weekly" as const,
                      title: "Weekly Summary",
                      desc: "Your XP and mastery progress from the week.",
                      value: weeklySummary,
                      set: setWeeklySummary,
                    },
                    {
                      key: "streak" as const,
                      title: "Streak Danger",
                      desc: "Alert when you are about to lose your streak.",
                      value: streakDanger,
                      set: setStreakDanger,
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 cursor-pointer hover:bg-white/[0.04] transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.value}
                        onChange={(e) => item.set(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-[14px] font-medium text-white">{item.title}</div>
                        <div className="mt-1 text-[13px] text-white/50">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                id="settings-save-notifications"
                onClick={handleSaveNotifications}
                disabled={notifSaving || notifLoading}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {notifSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Update preferences"
                )}
              </button>
            </div>
          )}

          {/* ── Security Tab ── */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white">Security</h3>
                <p className="mt-1 text-[14px] text-white/50">
                  Manage your account security and connections.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <div className="text-[13px] font-medium text-white/60">Signed in as</div>
                <div className="mt-1 text-[15px] text-white">{user?.email}</div>
                <div className="mt-2 text-[12px] text-white/30">
                  Auth provider: {user?.app_metadata?.provider ?? "email"}
                </div>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.02] p-6">
                <h4 className="text-[15px] font-medium text-rose-400">Danger Zone</h4>
                <p className="mt-2 text-[13px] text-white/50">
                  Permanently delete your account and all learning data. This action cannot be
                  undone.
                </p>
                <button className="mt-4 rounded-lg bg-rose-500/10 px-4 py-2 text-[13px] font-semibold text-rose-400 transition hover:bg-rose-500/20">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
