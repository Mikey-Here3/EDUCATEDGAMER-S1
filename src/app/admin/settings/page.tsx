import { sql } from '@/lib/db'
import SettingsForm from '@/components/admin/settings-form'

export const revalidate = 0

export default async function AdminSettingsPage() {
  let tournament: any = null

  try {
    const tRows = await sql`SELECT * FROM tournaments LIMIT 1;`
    tournament = tRows[0] || null
  } catch (err) {
    console.error('Neon admin settings query error:', err)
  }

  const defaultTournament = tournament || {
    max_teams: 12,
    prize_pool: '1500 Rs',
    status: 'upcoming',
    registration_open: true,
    map: '5-Map Series (Bermuda, Purgatory, Solara, NexTerra, Kalahari)',
    game_mode: 'Battle Royale (Squad)',
  }

  return (
    <div className="flex flex-col gap-6 p-6 text-white max-w-4xl">
      <h1 className="text-3xl font-black tracking-tight font-heading">Tournament Settings</h1>
      <SettingsForm tournament={defaultTournament} />
    </div>
  )
}
