import { sql } from '@/lib/db'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import StandingsShowcase from '@/components/standings/standings-showcase'

export const revalidate = 0

export default async function StandingsPage() {
  let standings: any[] = []
  let kills: any[] = []
  let teamsMap: Record<string, any> = {}

  try {
    const [sRows, kRows, tRows, pRows] = await Promise.all([
      sql`SELECT * FROM team_standings ORDER BY points DESC, kills DESC;`,
      sql`SELECT * FROM mvp_kills ORDER BY kills DESC;`,
      sql`SELECT id, team_name, team_code, logo_url, leader_name, leader_uid, whatsapp FROM teams WHERE status != 'rejected';`,
      sql`SELECT id, team_id, player_name, free_fire_uid, player_type FROM players ORDER BY created_at ASC;`
    ])

    standings = sRows || []
    kills = kRows || []

    const playersList = pRows || []
    const rawTeams = tRows || []

    // Build teams map by team_name for fast lookup
    rawTeams.forEach((team: any) => {
      const teamPlayers = playersList.filter((p: any) => p.team_id === team.id)
      teamsMap[team.team_name.toLowerCase()] = {
        ...team,
        players: teamPlayers
      }
    })
  } catch (err) {
    console.error('Neon public standings query error:', err)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <StandingsShowcase 
          initialStandings={standings} 
          initialKills={kills} 
          teamsMap={teamsMap} 
        />
      </main>

      <Footer />
    </div>
  )
}
