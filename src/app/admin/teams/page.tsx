import { sql } from '@/lib/db'
import TeamTable from '@/components/admin/team-table'

export const revalidate = 0

export default async function AdminTeamsPage() {
  let teams: any[] = []

  try {
    const [teamsRows, playersRows] = await Promise.all([
      sql`SELECT * FROM teams ORDER BY created_at DESC;`,
      sql`SELECT * FROM players ORDER BY created_at ASC;`
    ])

    teams = teamsRows.map((team: any) => ({
      ...team,
      players: playersRows.filter((p: any) => p.team_id === team.id)
    }))
  } catch (err) {
    console.error('Neon admin teams query error:', err)
  }

  return (
    <div className="flex flex-col gap-6 p-6 text-white max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight font-heading">Teams & Squad Rosters</h1>
        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-400 font-mono">
          Total: {teams.length} Teams
        </span>
      </div>
      <TeamTable initialTeams={teams} />
    </div>
  )
}
