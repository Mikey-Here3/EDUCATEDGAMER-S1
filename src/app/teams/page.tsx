import { sql } from '@/lib/db'
import { MAX_TEAMS } from '@/lib/constants'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { TeamsShowcase } from '@/components/teams/teams-showcase'

export const revalidate = 0

export default async function TeamsPage() {
  let teams: any[] = []
  let maxTeams = MAX_TEAMS
  let approvedCount = 0
  let pendingCount = 0

  try {
    const [tRows, teamsRows, playersRows] = await Promise.all([
      sql`SELECT max_teams FROM tournaments LIMIT 1;`,
      // Exclude rejected teams from public view
      sql`SELECT * FROM teams WHERE status != 'cancelled' AND status != 'rejected' ORDER BY created_at ASC;`,
      sql`SELECT * FROM players ORDER BY created_at ASC;`
    ])

    maxTeams = tRows[0]?.max_teams || MAX_TEAMS

    teams = teamsRows.map((team: any) => ({
      ...team,
      players: playersRows.filter((p: any) => p.team_id === team.id)
    }))

    approvedCount = teams.filter((t: any) => t.status === 'approved').length
    pendingCount = teams.filter((t: any) => t.status === 'pending').length
  } catch (err) {
    console.error('Neon teams query error:', err)
  }

  const slotsLeft = Math.max(0, maxTeams - teams.length)

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        {/* PAGE HEADER */}
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <p className="text-[#DC2626] font-black uppercase tracking-[0.3em] text-xs mb-3">Season 1 — Registered Squads</p>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight font-heading">
              <span className="text-white">THE </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-orange-500">ARENA</span>
            </h1>
            <p className="text-gray-400 text-sm mt-3 max-w-xl">
              All squads who've officially registered and confirmed their slot. Make sure your team is here — if missing, contact us immediately.
            </p>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {[
              { label: 'Total Slots', value: maxTeams, color: 'text-white', bg: 'border-white/10' },
              { label: 'Confirmed', value: approvedCount, color: 'text-green-400', bg: 'border-green-500/30' },
              { label: 'Pending Review', value: pendingCount, color: 'text-yellow-400', bg: 'border-yellow-500/30' },
              { label: 'Slots Left', value: slotsLeft, color: 'text-[#DC2626]', bg: 'border-[#DC2626]/30' },
            ].map((stat) => (
              <div key={stat.label} className={`bg-[#0a0a0f] border ${stat.bg} rounded-2xl p-4 text-center`}>
                <div className={`text-3xl font-black ${stat.color} font-mono`}>{stat.value}</div>
                <div className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-12 bg-[#0a0a0f] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3 text-xs font-bold">
              <span className="text-gray-400 uppercase tracking-widest">Tournament Capacity</span>
              <span className="text-white font-mono">{teams.length} / {maxTeams} Teams Registered</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#DC2626] to-orange-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                style={{ width: `${Math.min(100, (teams.length / maxTeams) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* TEAMS GRID or EMPTY */}
        {teams.length > 0 ? (
          <TeamsShowcase teams={teams} />
        ) : (
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center py-20 bg-[#0a0a0f] border border-white/10 rounded-3xl p-12 space-y-5 shadow-2xl">
              <div className="text-6xl">🛡️</div>
              <h3 className="text-3xl font-black text-white italic uppercase font-heading">No Squads Yet</h3>
              <p className="text-gray-400 text-sm">
                The battlefield is empty. Be the first squad to register and claim Slot #01!
              </p>
              <a
                href="/register"
                className="inline-block bg-gradient-to-r from-[#DC2626] to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]"
              >
                Register Your Squad ›
              </a>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
