-- ============================================================
-- EDUCATED GAMER — FREE FIRE TOURNAMENT
-- Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TOURNAMENTS TABLE
-- ============================================================
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date DATE,
  time TIME,
  max_teams INT NOT NULL DEFAULT 12,
  team_size INT NOT NULL DEFAULT 4,
  game_mode TEXT DEFAULT 'Battle Royale',
  map TEXT DEFAULT 'Bermuda',
  prize_pool TEXT DEFAULT 'TBD',
  registration_open BOOLEAN NOT NULL DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  counting_policy TEXT NOT NULL DEFAULT 'all' CHECK (counting_policy IN ('all', 'approved')),
  show_player_details BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TEAMS TABLE
-- ============================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_code TEXT UNIQUE NOT NULL,
  team_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_uid TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  discord TEXT,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, team_name)
);

CREATE INDEX idx_teams_tournament_id ON teams(tournament_id);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_team_code ON teams(team_code);
CREATE INDEX idx_teams_created_at ON teams(created_at DESC);

-- ============================================================
-- PLAYERS TABLE
-- ============================================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  free_fire_uid TEXT NOT NULL,
  player_type TEXT NOT NULL CHECK (player_type IN ('leader', 'player', 'substitute')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, free_fire_uid)
);

CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_tournament_id ON players(tournament_id);
CREATE INDEX idx_players_free_fire_uid ON players(free_fire_uid);

-- ============================================================
-- TOURNAMENT SETTINGS (Key-Value)
-- ============================================================
CREATE TABLE tournament_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  UNIQUE(tournament_id, key)
);

CREATE INDEX idx_settings_tournament_id ON tournament_settings(tournament_id);

-- ============================================================
-- ADMIN LOGS
-- ============================================================
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CONCURRENCY-SAFE REGISTRATION FUNCTION
-- Uses FOR UPDATE row locking to prevent race conditions
-- ============================================================
CREATE OR REPLACE FUNCTION register_team(
  p_tournament_id UUID,
  p_team_name TEXT,
  p_leader_name TEXT,
  p_leader_uid TEXT,
  p_whatsapp TEXT,
  p_discord TEXT,
  p_logo_url TEXT,
  p_players JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tournament RECORD;
  v_current_count INT;
  v_team_id UUID;
  v_team_code TEXT;
  v_seq INT;
  v_player JSONB;
  v_existing_uid TEXT;
BEGIN
  -- 1. Lock the tournament row to serialize concurrent registrations
  SELECT id, max_teams, registration_open, counting_policy, status, registration_deadline
  INTO v_tournament
  FROM tournaments
  WHERE id = p_tournament_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;

  -- Check registration is open
  IF NOT v_tournament.registration_open THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration is currently closed');
  END IF;

  IF v_tournament.status != 'upcoming' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament is not accepting registrations');
  END IF;

  -- Check deadline
  IF v_tournament.registration_deadline IS NOT NULL AND NOW() > v_tournament.registration_deadline THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration deadline has passed');
  END IF;

  -- 2. Count current registrations based on counting policy
  IF v_tournament.counting_policy = 'approved' THEN
    SELECT COUNT(*) INTO v_current_count
    FROM teams
    WHERE tournament_id = p_tournament_id AND status = 'approved';
  ELSE
    SELECT COUNT(*) INTO v_current_count
    FROM teams
    WHERE tournament_id = p_tournament_id AND status NOT IN ('rejected', 'cancelled');
  END IF;

  IF v_current_count >= v_tournament.max_teams THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament is full. All slots have been taken.');
  END IF;

  -- 3. Check for duplicate team name
  IF EXISTS (
    SELECT 1 FROM teams
    WHERE tournament_id = p_tournament_id
    AND LOWER(TRIM(team_name)) = LOWER(TRIM(p_team_name))
    AND status NOT IN ('rejected', 'cancelled')
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'A team with this name already exists');
  END IF;

  -- 4. Check for duplicate UIDs across tournament
  -- Check leader UID
  SELECT free_fire_uid INTO v_existing_uid
  FROM players
  WHERE tournament_id = p_tournament_id AND free_fire_uid = p_leader_uid;

  IF v_existing_uid IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Leader UID ' || p_leader_uid || ' is already registered in another team');
  END IF;

  -- Check all player UIDs
  FOR v_player IN SELECT * FROM jsonb_array_elements(p_players)
  LOOP
    IF v_player->>'free_fire_uid' IS NOT NULL AND v_player->>'free_fire_uid' != '' THEN
      SELECT free_fire_uid INTO v_existing_uid
      FROM players
      WHERE tournament_id = p_tournament_id AND free_fire_uid = (v_player->>'free_fire_uid');

      IF v_existing_uid IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Player UID ' || (v_player->>'free_fire_uid') || ' is already registered in another team');
      END IF;
    END IF;
  END LOOP;

  -- 5. Generate team code
  SELECT COUNT(*) + 1 INTO v_seq FROM teams WHERE tournament_id = p_tournament_id;
  v_team_code := 'EG-' || LPAD(v_seq::TEXT, 3, '0');

  -- Ensure unique team code
  WHILE EXISTS (SELECT 1 FROM teams WHERE team_code = v_team_code) LOOP
    v_seq := v_seq + 1;
    v_team_code := 'EG-' || LPAD(v_seq::TEXT, 3, '0');
  END LOOP;

  -- 6. Insert team
  INSERT INTO teams (tournament_id, team_code, team_name, leader_name, leader_uid, whatsapp, discord, logo_url)
  VALUES (p_tournament_id, v_team_code, TRIM(p_team_name), TRIM(p_leader_name), TRIM(p_leader_uid), TRIM(p_whatsapp), NULLIF(TRIM(COALESCE(p_discord, '')), ''), NULLIF(TRIM(COALESCE(p_logo_url, '')), ''))
  RETURNING id INTO v_team_id;

  -- 7. Insert leader as player
  INSERT INTO players (team_id, tournament_id, player_name, free_fire_uid, player_type)
  VALUES (v_team_id, p_tournament_id, TRIM(p_leader_name), TRIM(p_leader_uid), 'leader');

  -- 8. Insert other players
  FOR v_player IN SELECT * FROM jsonb_array_elements(p_players)
  LOOP
    IF v_player->>'player_name' IS NOT NULL AND v_player->>'player_name' != ''
       AND v_player->>'free_fire_uid' IS NOT NULL AND v_player->>'free_fire_uid' != '' THEN
      INSERT INTO players (team_id, tournament_id, player_name, free_fire_uid, player_type)
      VALUES (
        v_team_id,
        p_tournament_id,
        TRIM(v_player->>'player_name'),
        TRIM(v_player->>'free_fire_uid'),
        COALESCE(v_player->>'player_type', 'player')
      );
    END IF;
  END LOOP;

  -- 9. Return success
  RETURN jsonb_build_object(
    'success', true,
    'team_id', v_team_id,
    'team_code', v_team_code,
    'team_name', TRIM(p_team_name)
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'Duplicate entry detected. Please check team name and player UIDs.');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration failed. Please try again.');
END;
$$;

-- ============================================================
-- HELPER FUNCTION: Get registration count
-- ============================================================
CREATE OR REPLACE FUNCTION get_registration_count(p_tournament_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
  v_policy TEXT;
BEGIN
  SELECT counting_policy INTO v_policy FROM tournaments WHERE id = p_tournament_id;

  IF v_policy = 'approved' THEN
    SELECT COUNT(*) INTO v_count
    FROM teams
    WHERE tournament_id = p_tournament_id AND status = 'approved';
  ELSE
    SELECT COUNT(*) INTO v_count
    FROM teams
    WHERE tournament_id = p_tournament_id AND status NOT IN ('rejected', 'cancelled');
  END IF;

  RETURN v_count;
END;
$$;
