import { createClient } from '@/lib/supabase/server';
import { TOURNAMENT_ID } from '@/lib/constants';
import StandingsEditor from '@/components/admin/standings-editor';

export default async function AdminStandingsPage() {
  const supabase = await createClient();
  const { data: standings } = await supabase.from('team_standings').select('*').eq('tournament_id', TOURNAMENT_ID).order('points', { ascending: false });
  const { data: kills } = await supabase.from('mvp_kills').select('*').eq('tournament_id', TOURNAMENT_ID).order('kills', { ascending: false });
  const { data: teams } = await supabase.from('teams').select('id, team_name').eq('tournament_id', TOURNAMENT_ID).eq('status', 'approved');

  return (
    <div className="flex flex-col gap-6 p-6 text-white max-w-5xl">
      <h1 className="text-3xl font-black tracking-tight">Standings & Kills Manager</h1>
      <StandingsEditor standings={standings || []} kills={kills || []} teams={teams || []} tournamentId={TOURNAMENT_ID} />
    </div>
  );
}
