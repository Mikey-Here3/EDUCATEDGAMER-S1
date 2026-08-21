import { sql } from '@/lib/db'
import StandingsEditor from '@/components/admin/standings-editor'

export const revalidate = 0

export default async function AdminStandingsPage() {
  let standings: any[] = []
  let kills: any[] = []
  let teams: any[] = []

  try {
    const [sRows, kRows, tRows, pRows] = await Promise.all([
      sql`SELECT * FROM team_standings ORDER BY points DESC;`,
      sql`SELECT * FROM mvp_kills ORDER BY kills DESC;`,
      sql`SELECT id, team_name, team_code, logo_url, leader_name, leader_uid FROM teams WHERE status != 'rejected' ORDER BY team_name ASC;`,
      sql`SELECT id, team_id, player_name, free_fire_uid, player_type FROM players ORDER BY player_name ASC;`,
    ])

    standings = sRows || []
    kills = kRows || []

    const playersList = pRows || []

    teams = (tRows || []).map((t: any) => ({
      ...t,
      players: playersList.filter((p: any) => p.team_id === t.id)
    }))
  } catch (err) {
    console.error('Neon admin standings query error:', err)
  }

  return (
    <div className="flex flex-col gap-6 p-6 text-white max-w-5xl">
      <h1 className="text-3xl font-black tracking-tight font-heading">Standings & MVP Kills Manager</h1>
      <StandingsEditor standings={standings} kills={kills} teams={teams} tournamentId="a0000000-0000-0000-0000-000000000001" />
    </div>
  )
}
