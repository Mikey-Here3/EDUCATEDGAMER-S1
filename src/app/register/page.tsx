import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { RegistrationClosed } from '@/components/registration/registration-closed'
import { RegistrationForm } from '@/components/registration/registration-form'
import { createClient } from '@/lib/supabase/server'
import { TOURNAMENT_ID } from '@/lib/constants'

export default async function RegisterPage() {
  const supabase = await createClient()

  // Fetch tournament and registration count
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*, teams(count)')
    .eq('id', TOURNAMENT_ID)
    .single()

  const activeTournament = tournament || {
    id: TOURNAMENT_ID,
    max_teams: 12,
    registration_open: true,
    teams: [{ count: 0 }]
  }

  const registeredCount = activeTournament.teams?.[0]?.count || 0
  const isClosed = registeredCount >= activeTournament.max_teams || !activeTournament.registration_open

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
          <RegistrationClosed maxTeams={activeTournament.max_teams} registeredCount={registeredCount} />
        ) : (
          <RegistrationForm 
            tournamentId={activeTournament.id} 
            registeredCount={registeredCount} 
            maxTeams={activeTournament.max_teams} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  )
}
