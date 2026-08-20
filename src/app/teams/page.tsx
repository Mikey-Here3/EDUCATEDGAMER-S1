import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { PageHeader } from '@/components/shared/page-header'
import { TeamGrid } from '@/components/teams/team-grid'
import { createClient } from '@/lib/supabase/server'
import { TOURNAMENT_ID, MAX_TEAMS } from '@/lib/constants'

export default async function TeamsPage() {
  const supabase = await createClient()

  // Fetch tournament and teams with full players roster
  const [{ data: tournament }, { data: teams }] = await Promise.all([
    supabase.from('tournaments').select('*').eq('id', TOURNAMENT_ID).maybeSingle(),
    supabase.from('teams')
      .select('*, players(*)')
      .eq('tournament_id', TOURNAMENT_ID)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true })
  ])

  const registeredCount = teams?.length || 0
  const maxTeams = tournament?.max_teams || MAX_TEAMS

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-32 pb-24">
        <PageHeader 
          title="REGISTERED SQUADS & ROSTERS" 
          subtitle={`${registeredCount} / ${maxTeams} Verified Teams — Public Tournament Roster`} 
        />
        
        {teams && teams.length > 0 ? (
          <div className="mt-12 max-w-6xl mx-auto">
            <TeamGrid teams={teams} showPlayers={true} />
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-20 bg-[#0a0a0f] border border-white/10 rounded-2xl p-10 mt-12 space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🛡️
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase font-heading">No Teams Registered Yet</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Be the first squad to register and claim slot #01 in the championship!
            </p>
            <a 
              href="/register" 
              className="inline-block bg-[#DC2626] hover:bg-[#b91c1c] text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all"
            >
              Register Squad Now ›
            </a>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
