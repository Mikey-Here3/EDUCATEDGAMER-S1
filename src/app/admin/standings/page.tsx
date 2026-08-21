import { sql } from '@/lib/db'
import StandingsEditor from '@/components/admin/standings-editor'

export const revalidate = 0

export default async function AdminStandingsPage() {
  let standings: any[] = []
  let kills: any[] = []
  let teams: any[] = []

  try {
    const [sRows, kRows, tRows] = await Promise.all([
      sql`SELECT * FROM team_standings ORDER BY points DESC;`,
      sql`SELECT * FROM mvp_kills ORDER BY kills DESC;`,
      sql`SELECT id, team_name FROM teams WHERE status = 'approved';`,
    ])
    standings = sRows || []
    kills = kRows || []
    teams = tRows || []
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
