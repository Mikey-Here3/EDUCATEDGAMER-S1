import { createClient } from '@/lib/supabase/server';
import { TOURNAMENT_ID, MAX_TEAMS } from '@/lib/constants';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Hero from '@/components/home/hero';
import TournamentStats from '@/components/home/tournament-stats';
import TournamentInfo from '@/components/home/tournament-info';
import HowItWorks from '@/components/home/how-it-works';
import TournamentOverview from '@/components/home/tournament-overview';
import EsportsRules from '@/components/home/esports-rules';
import StandingsLeaderboard from '@/components/home/standings-leaderboard';
import WinnersSection from '@/components/home/winners-section';
import FaqSection from '@/components/home/faq-section';
import CommunitySection from '@/components/home/community-section';

export default async function HomePage() {
  const supabase = await createClient();
  
  const [
    { data: tournament },
    { count: registeredCount },
    { data: settingsData },
    { data: standings },
    { data: kills },
    { data: winners },
  ] = await Promise.all([
    supabase.from('tournaments').select('*').eq('id', TOURNAMENT_ID).single(),
    supabase.from('teams').select('*', { count: 'exact', head: true }).eq('tournament_id', TOURNAMENT_ID).not('status', 'in', '("rejected","cancelled")'),
    supabase.from('tournament_settings').select('*').eq('tournament_id', TOURNAMENT_ID),
    supabase.from('team_standings').select('*').eq('tournament_id', TOURNAMENT_ID).order('points', { ascending: false }),
    supabase.from('mvp_kills').select('*').eq('tournament_id', TOURNAMENT_ID).order('kills', { ascending: false }),
    supabase.from('winners').select('*').eq('tournament_id', TOURNAMENT_ID).order('position'),
  ]);

  const settings = settingsData?.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {}) || {};
  const activeTournament = tournament || { prize_pool: '1500 Rs', map: 'Bermuda', game_mode: 'Battle Royale', max_teams: 12, registration_open: true };

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero 
          tournament={activeTournament} 
          registeredCount={registeredCount || 0} 
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
        <StandingsLeaderboard standings={standings || []} kills={kills || []} />

        {/* How to Compete */}
        <HowItWorks />

        {/* Championship Winners */}
        {winners && winners.length > 0 && <WinnersSection winners={winners} />}

        {/* FAQ */}
        <FaqSection />

        {/* Community Section */}
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
