import { createClient } from '@/lib/supabase/server';
import { TOURNAMENT_ID } from '@/lib/constants';
import WinnersEditor from '@/components/admin/winners-editor';

export default async function AdminWinnersPage() {
  const supabase = await createClient();
  const { data: winners } = await supabase.from('winners').select('*').eq('tournament_id', TOURNAMENT_ID).order('position');
  return (
    <div className="flex flex-col gap-6 p-6 text-white max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight">Championship Winners</h1>
      <WinnersEditor winners={winners || []} tournamentId={TOURNAMENT_ID} />
    </div>
  );
}
