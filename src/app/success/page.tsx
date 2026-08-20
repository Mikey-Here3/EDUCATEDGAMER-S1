import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/status-badge'
import { GlowCard } from '@/components/shared/glow-card'
import { CopyButton } from '@/components/shared/copy-button'

export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ code?: string }> | { code?: string } 
}) {
  const resolvedParams = await searchParams
  const teamCode = resolvedParams?.code

  if (!teamCode) {
    redirect('/register')
  }

  const supabase = await createClient()
  
  const { data: team, error } = await supabase
    .from('teams')
    .select(`
      *,
      team_players (*)
    `)
    .eq('team_code', teamCode)
    .single()

  if (error || !team) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050507] text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Team Not Found</h1>
            <p className="text-gray-400 mb-6">We couldn't find a team with code {teamCode}.</p>
            <Link href="/register" className={cn(buttonVariants({ variant: 'default' }))}>
              Back to Registration
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-6xl mb-6">🎉</div>
        
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-blue-500 mb-4 text-center">
          REGISTRATION COMPLETE
        </h1>
        
        <p className="text-gray-400 text-lg text-center max-w-2xl mb-10">
          Your team has been successfully registered for the tournament. 
          Please save your team code and join our Discord server for updates.
        </p>
        
        <GlowCard className="w-full max-w-2xl mb-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Team Code</p>
            <div className="inline-flex items-center gap-3 bg-[#13131A] px-6 py-3 rounded-lg border border-[#DC2626]/30">
              <span className="text-3xl font-mono font-bold text-white tracking-wider">{teamCode}</span>
              <CopyButton text={teamCode} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-800 pt-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{team.team_name}</h2>
              <StatusBadge status={team.status} />
            </div>
            {team.logo_url && (
              <img 
                src={team.logo_url} 
                alt={`${team.team_name} logo`} 
                className="w-16 h-16 rounded-full object-cover mt-4 sm:mt-0"
              />
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#DC2626]">Roster</h3>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center bg-[#050507] p-3 rounded border border-gray-800">
                <div>
                  <span className="text-white font-medium">{team.leader_name}</span>
                  <span className="ml-2 text-xs bg-[#DC2626]/20 text-[#DC2626] px-2 py-1 rounded">Leader</span>
                </div>
                <span className="text-gray-400 font-mono text-sm">{team.leader_uid}</span>
              </div>
              
              {team.team_players?.map((player: any) => (
                <div key={player.id} className="flex justify-between items-center bg-[#050507] p-3 rounded border border-gray-800">
                  <div>
                    <span className="text-white font-medium">{player.player_name}</span>
                    {player.player_type === 'substitute' && (
                      <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Sub</span>
                    )}
                  </div>
                  <span className="text-gray-400 font-mono text-sm">{player.free_fire_uid}</span>
                </div>
              ))}
            </div>
          </div>
        </GlowCard>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <Link 
            href="https://discord.gg/bE2Cta8q" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'default' }),
              "flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white"
            )}
          >
            JOIN DISCORD
          </Link>
          <Link 
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              "flex-1 border-gray-700 text-gray-300 hover:text-white"
            )}
          >
            BACK TO HOME
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
