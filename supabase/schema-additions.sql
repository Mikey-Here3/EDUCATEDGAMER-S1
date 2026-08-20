-- ============================================================
-- EDUCATED GAMER — ADDITIONAL TABLES (Run after schema.sql)
-- ============================================================

-- Team Standings / Points Table
CREATE TABLE IF NOT EXISTS team_standings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  kills integer DEFAULT 0,
  points integer DEFAULT 0,
  position integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- MVP / Most Kills Table
CREATE TABLE IF NOT EXISTS mvp_kills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  team_name text NOT NULL,
  kills integer DEFAULT 0,
  match_no integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Championship Winners
CREATE TABLE IF NOT EXISTS winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  position text NOT NULL,
  team_name text NOT NULL,
  prize text,
  season text,
  created_at timestamptz DEFAULT now()
);

-- Gallery / Highlights
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text,
  description text,
  match_no integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE team_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mvp_kills ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read standings" ON team_standings FOR SELECT USING (true);
CREATE POLICY "Public read kills" ON mvp_kills FOR SELECT USING (true);
CREATE POLICY "Public read winners" ON winners FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);

-- ============================================================
-- ADMIN USER SEED
-- After running this, create an admin user in Supabase Dashboard:
-- Authentication > Users > Add User
-- Email: admin@educatedgamer.com
-- Password: EG@Admin2024!
-- ============================================================
