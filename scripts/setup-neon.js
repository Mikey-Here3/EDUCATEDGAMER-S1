const { neon } = require('@neondatabase/serverless')

const databaseUrl = 'postgresql://neondb_owner:npg_vfk8r7bpSLsD@ep-restless-hat-b3bms7fa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

async function setup() {
  console.log('Connecting to Neon Database...')
  const sql = neon(databaseUrl)

  // 1. Tournaments
  console.log('Creating tournaments table...')
  await sql`
    CREATE TABLE IF NOT EXISTS tournaments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      date DATE,
      time TIME,
      max_teams INT NOT NULL DEFAULT 12,
      team_size INT NOT NULL DEFAULT 4,
      game_mode TEXT DEFAULT 'Battle Royale',
      map TEXT DEFAULT '5-Map Series',
      prize_pool TEXT DEFAULT '1500 Rs',
      registration_open BOOLEAN NOT NULL DEFAULT true,
      registration_deadline TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'upcoming',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // 2. Teams
  console.log('Creating teams table...')
  await sql`
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tournament_id UUID,
      team_code TEXT UNIQUE NOT NULL,
      team_name TEXT NOT NULL,
      leader_name TEXT NOT NULL,
      leader_uid TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      discord TEXT,
      logo_url TEXT,
      uid_screenshot_url TEXT,
      payment_proof_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // 3. Players
  console.log('Creating players table...')
  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
      player_name TEXT NOT NULL,
      free_fire_uid TEXT NOT NULL,
      player_type TEXT NOT NULL DEFAULT 'player',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // 4. Standings
  console.log('Creating standings table...')
  await sql`
    CREATE TABLE IF NOT EXISTS team_standings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_name TEXT NOT NULL,
      kills INT DEFAULT 0,
      points INT DEFAULT 0,
      position INT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // 5. MVP Kills
  console.log('Creating MVP kills table...')
  await sql`
    CREATE TABLE IF NOT EXISTS mvp_kills (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      player_name TEXT NOT NULL,
      team_name TEXT NOT NULL,
      kills INT DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // 6. Winners
  console.log('Creating winners table...')
  await sql`
    CREATE TABLE IF NOT EXISTS winners (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      position TEXT NOT NULL,
      team_name TEXT NOT NULL,
      prize TEXT,
      season TEXT DEFAULT '1',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // 7. Seed initial tournament
  const existing = await sql`SELECT id FROM tournaments LIMIT 1;`
  if (existing.length === 0) {
    console.log('Seeding initial tournament...')
    await sql`
      INSERT INTO tournaments (
        id, name, slug, description, max_teams, team_size, game_mode, map, prize_pool, registration_open, status
      ) VALUES (
        'a0000000-0000-0000-0000-000000000001',
        'Educated Gamer Free Fire Championship Season 1',
        'eg-ff-s1',
        'Official 12-team squad battle royale tournament with 20X rewards',
        12, 4, 'Battle Royale (Squad)', '5-Map Series (Bermuda, Purgatory, Solara, NexTerra, Kalahari)', '1500 Rs', true, 'upcoming'
      );
    `
  }

  console.log('✅ ALL TABLES CREATED AND SEEDED IN NEON DATABASE SUCCESSFULLY!')
}

setup().catch(err => {
  console.error('Setup error:', err)
  process.exit(1)
})
