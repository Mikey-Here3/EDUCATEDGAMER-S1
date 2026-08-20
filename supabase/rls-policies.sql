-- ============================================================
-- EDUCATED GAMER — ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TOURNAMENTS — Public read, authenticated write
-- ============================================================
CREATE POLICY "Public can view tournaments"
  ON tournaments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tournaments"
  ON tournaments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TEAMS — Public can view non-sensitive data, authenticated full access
-- ============================================================
CREATE POLICY "Public can view teams"
  ON teams FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage teams"
  ON teams FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- PLAYERS — Public can view (filtered by app), authenticated full access
-- ============================================================
CREATE POLICY "Public can view players"
  ON players FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage players"
  ON players FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TOURNAMENT SETTINGS — Public read, authenticated write
-- ============================================================
CREATE POLICY "Public can view settings"
  ON tournament_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON tournament_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- ADMIN LOGS — Authenticated only
-- ============================================================
CREATE POLICY "Authenticated can view admin logs"
  ON admin_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert admin logs"
  ON admin_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
