/* ============================================================
   006_skill_enrollments.sql
   Explicit enrollment table to track which skills a user has
   chosen to start (separate from mere activity in user_skill_progress).
   ============================================================ */

CREATE TABLE IF NOT EXISTS user_skill_enrollments (
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id    UUID NOT NULL REFERENCES skills(id)   ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, skill_id)
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_skill_enrollments_user
  ON user_skill_enrollments (user_id, enrolled_at DESC);

-- RLS: users can only see / manage their own enrollments
ALTER TABLE user_skill_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_enrollments_select"
  ON user_skill_enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "own_enrollments_insert"
  ON user_skill_enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_enrollments_delete"
  ON user_skill_enrollments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Leaderboard view: weekly XP + streak per user (used by fetchLeaderboard)
-- Drop the view first to avoid signature change errors when replacing it
DROP VIEW IF EXISTS weekly_leaderboard;

CREATE OR REPLACE VIEW weekly_leaderboard AS
  WITH week_start AS (
    SELECT date_trunc('week', NOW()) AS ts
  ),
  weekly_xp_agg AS (
    SELECT
      xl.user_id,
      SUM(xl.amount) AS weekly_xp
    FROM xp_ledger xl, week_start ws
    WHERE xl.created_at >= ws.ts
    GROUP BY xl.user_id
  )
  SELECT
    p.id            AS user_id,
    p.display_name,
    p.avatar_url,
    COALESCE(wx.weekly_xp, 0)::INT   AS weekly_xp,
    COALESCE(us.current_streak, 0)   AS current_streak,
    RANK() OVER (ORDER BY COALESCE(wx.weekly_xp, 0) DESC) AS rank
  FROM profiles p
  LEFT JOIN weekly_xp_agg  wx ON wx.user_id = p.id
  LEFT JOIN user_streaks   us ON us.user_id = p.id
  WHERE p.leaderboard_opt_in = TRUE
    AND p.profile_public = TRUE
  ORDER BY weekly_xp DESC;
