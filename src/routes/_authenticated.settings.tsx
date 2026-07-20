import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { Settings, User, Bell, Shield, LogOut } from "lucide-react";

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

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

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
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                activeTab === "profile"
                  ? "bg-white/[0.06] text-white"
                  : "text-white/50 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <User className="h-4 w-4" />
              Profile details
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                activeTab === "notifications"
                  ? "bg-white/[0.06] text-white"
                  : "text-white/50 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                activeTab === "security"
                  ? "bg-white/[0.06] text-white"
                  : "text-white/50 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
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
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white">Public Profile</h3>
                <p className="mt-1 text-[14px] text-white/50">
                  This information will be displayed on your public profile and leaderboard.
                </p>
              </div>

              <div className="grid gap-6">
                <div>
                  <label className="block text-[13px] font-medium text-white/70">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || ""}
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-white/70">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a little about yourself"
                    className="mt-2 block w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-white transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90">
                Save changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
                <p className="mt-1 text-[14px] text-white/50">
                  Choose what we can send you. We only send high-signal emails.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Daily Practice Reminder",
                    desc: "A short reminder to keep your streak alive.",
                  },
                  { title: "Weekly Summary", desc: "Your XP and mastery progress from the week." },
                  { title: "Streak Danger", desc: "Alert when you are about to lose your streak." },
                ].map((item) => (
                  <label
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 cursor-pointer hover:bg-white/[0.04] transition"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-[14px] font-medium text-white">{item.title}</div>
                      <div className="mt-1 text-[13px] text-white/50">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition hover:bg-white/90">
                Update preferences
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white">Security</h3>
                <p className="mt-1 text-[14px] text-white/50">
                  Manage your account security and connections.
                </p>
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
