import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { RegistrationClosed } from '@/components/registration/registration-closed'
import { RegistrationForm } from '@/components/registration/registration-form'
import { sql } from '@/lib/db'
import { MAX_TEAMS } from '@/lib/constants'

export const revalidate = 0

export default async function RegisterPage() {
  let tournament: any = null
  let registeredCount = 0

  try {
    const [tRows, cRows] = await Promise.all([
      sql`SELECT * FROM tournaments LIMIT 1;`,
      sql`SELECT COUNT(*)::int as count FROM teams WHERE status != 'rejected' AND status != 'cancelled';`
    ])
    tournament = tRows[0] || null
    registeredCount = cRows[0]?.count || 0
  } catch (err) {
    console.error('Neon register page error:', err)
  }

  const activeTournament = tournament || {
    id: 'a0000000-0000-0000-0000-000000000001',
    max_teams: 12,
    registration_open: true,
  }

  const maxTeams = activeTournament.max_teams || MAX_TEAMS
  const isClosed = registeredCount >= maxTeams || !activeTournament.registration_open

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-32 pb-16">
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase font-heading text-white">
            EDUCATED GAMER <span className="text-[#DC2626] drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">CHAMPIONSHIP</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-bold uppercase tracking-wider">
            Fill out the details below to secure your spot. Mode: <span className="text-[#DC2626] font-black">SQUAD (5 Maps)</span>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full mt-4" />
        </div>
        
        {isClosed ? (
          <RegistrationClosed maxTeams={maxTeams} registeredCount={registeredCount} />
        ) : (
          <RegistrationForm 
            tournamentId={activeTournament.id} 
            registeredCount={registeredCount} 
            maxTeams={maxTeams} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  )
}
