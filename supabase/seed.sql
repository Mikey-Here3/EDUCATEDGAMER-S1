-- ============================================================
-- EDUCATED GAMER — SEED DATA
-- Run this after schema.sql and rls-policies.sql
-- ============================================================

-- Insert default tournament
INSERT INTO tournaments (
  id,
  name,
  slug,
  description,
  date,
  time,
  max_teams,
  team_size,
  game_mode,
  map,
  prize_pool,
  registration_open,
  counting_policy,
  show_player_details,
  status
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Educated Gamer Free Fire Tournament Season 1',
  'eg-ff-tournament-s1',
  'The ultimate Free Fire tournament brought to you by Educated Gamer. 12 teams battle it out for glory and prizes. Show your skills and become the champion!',
  NULL,
  NULL,
  12,
  4,
  'Battle Royale',
  'Bermuda',
  '1500 Rs',
  true,
  'all',
  false,
  'upcoming'
);

-- Insert default settings
INSERT INTO tournament_settings (tournament_id, key, value) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'hero_title', 'EDUCATED GAMER'),
  ('a0000000-0000-0000-0000-000000000001', 'hero_subtitle', 'FREE FIRE TOURNAMENT'),
  ('a0000000-0000-0000-0000-000000000001', 'hero_tagline', '12 TEAMS. ONE CHAMPION.'),
  ('a0000000-0000-0000-0000-000000000001', 'youtube_url', 'https://youtube.com/@educatedgamer3'),
  ('a0000000-0000-0000-0000-000000000001', 'tiktok_url', 'https://tiktok.com/@educatedgamer3'),
  ('a0000000-0000-0000-0000-000000000001', 'facebook_url', 'https://facebook.com/EducatedGamer3'),
  ('a0000000-0000-0000-0000-000000000001', 'discord_url', 'https://discord.gg/bE2Cta8q'),
  ('a0000000-0000-0000-0000-000000000001', 'custom_room_info', 'Room ID and password will be shared on Discord 30 minutes before the tournament starts.'),
  ('a0000000-0000-0000-0000-000000000001', 'rules', '[{"title":"Entry Fee & Rewards","content":"Entry fee is 100 Rs per team. The winning team will receive 1500 Rs. The player with the most kills (MVP) will receive 100 Rs. 20X REWARD!"},{"title":"Waiting List Policy","content":"Only the first 12 teams will be confirmed. If any of the confirmed 12 teams fail to show up, the next teams in the waiting list will get the chance to play."},{"title":"Team Rules","content":"Each team must have exactly 4 players and may include 1 substitute. Team leaders are responsible for their team members. Teams must be ready 15 minutes before the match starts."},{"title":"Gameplay Rules","content":"All weapons and items available in the game are allowed. No use of hacks, mods, or any third-party software. Screen recording may be required for verification."},{"title":"Custom Room Rules","content":"Room ID and password will be shared via Discord. Players must join within the specified time window. Late entries will not be accommodated."}]');

-- ============================================================
-- ADMIN SETUP
-- After running this seed, create an admin user via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Enter email and password
-- 4. The admin can then log in at /admin/login
-- ============================================================
