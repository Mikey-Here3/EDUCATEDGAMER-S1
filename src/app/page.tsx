import { sql } from '@/lib/db'
import { MAX_TEAMS } from '@/lib/constants'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Hero from '@/components/home/hero'
import TournamentStats from '@/components/home/tournament-stats'
import TournamentInfo from '@/components/home/tournament-info'
import HowItWorks from '@/components/home/how-it-works'
import TournamentOverview from '@/components/home/tournament-overview'
import EsportsRules from '@/components/home/esports-rules'
import StandingsLeaderboard from '@/components/home/standings-leaderboard'
import WinnersSection from '@/components/home/winners-section'
import FaqSection from '@/components/home/faq-section'
import CommunitySection from '@/components/home/community-section'

export const revalidate = 0 // live dynamic data

export default async function HomePage() {
  let tournament: any = null
  let registeredCount = 0
  let standings: any[] = []
  let kills: any[] = []
  let winners: any[] = []
  let teams: any[] = []

  try {
    const [tRes, cRes, sRes, kRes, wRes, teamsRes] = await Promise.all([
      sql`SELECT * FROM tournaments LIMIT 1;`,
      sql`SELECT COUNT(*)::int as count FROM teams WHERE status != 'rejected' AND status != 'cancelled';`,
      sql`SELECT * FROM team_standings ORDER BY points DESC;`,
      sql`SELECT * FROM mvp_kills ORDER BY kills DESC;`,
      sql`SELECT * FROM winners ORDER BY position ASC;`,
      sql`SELECT id, team_name, logo_url, team_code FROM teams WHERE status != 'rejected';`,
    ])

    tournament = tRes[0] || null
    registeredCount = cRes[0]?.count || 0
    standings = sRes || []
    kills = kRes || []
    winners = wRes || []
    teams = teamsRes || []
  } catch (err) {
    console.error('Neon homepage query error:', err)
  }

  const activeTournament = tournament || {
    prize_pool: '1000 Rs',
    map: '5-Map Series (Bermuda, Purgatory, Solara, NexTerra, Kalahari)',
    game_mode: 'Battle Royale (Squad)',
    max_teams: 12,
    registration_open: true,
  }

  const settings = {
    custom_room_info: 'Lobby credentials shared on official WhatsApp 15m prior',
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero 
          tournament={activeTournament} 
          registeredCount={registeredCount} 
          maxTeams={activeTournament.max_teams || MAX_TEAMS} 
          settings={settings} 
        />
        {/* Quick Stats Bar */}
        <div className="container mx-auto px-4 py-16">
          <TournamentStats tournament={activeTournament} />
        </div>

        {/* Tournament Overview + Point System */}
        <TournamentOverview tournament={activeTournament} />

        {/* Tournament Info Cards */}
        <div className="container mx-auto px-4 py-16">
          <TournamentInfo tournament={activeTournament} settings={settings} />
        </div>

        {/* Esports Rules */}
        <EsportsRules />

        {/* Standings Leaderboard + Most Kills */}
        <StandingsLeaderboard standings={standings} kills={kills} teams={teams} />

        {/* How to Compete */}
        <HowItWorks />

        {/* Championship Winners */}
        {winners && winners.length > 0 && <WinnersSection winners={winners} />}

        {/* FAQ */}
        <FaqSection />

        {/* Community Section with Contribution Banner */}
        <CommunitySection />
      </main>
      <Footer />
    </div>
  )
}
