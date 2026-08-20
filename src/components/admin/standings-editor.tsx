'use client';
import { useState } from 'react';
import { Trophy, Crosshair, Plus, Trash2 } from 'lucide-react';
import { upsertStanding, upsertKill, deleteStanding, deleteKill } from '@/actions/admin-standings';

export default function StandingsEditor({ standings, kills, teams, tournamentId }: any) {
  const [activeTab, setActiveTab] = useState<'standings'|'kills'>('standings');
  const [standingsData, setStandingsData] = useState(standings);
  const [killsData, setKillsData] = useState(kills);
  const [loading, setLoading] = useState(false);
  const [newStanding, setNewStanding] = useState({ team_name: '', kills: 0, points: 0 });
  const [newKill, setNewKill] = useState({ player_name: '', team_name: '', kills: 0 });

  const handleAddStanding = async () => {
    if (!newStanding.team_name) return;
    setLoading(true);
    const res = await upsertStanding({ ...newStanding, tournament_id: tournamentId });
    if (res.success) {
      setStandingsData([...standingsData, { ...newStanding, id: res.id }]);
      setNewStanding({ team_name: '', kills: 0, points: 0 });
    }
    setLoading(false);
  };

  const handleAddKill = async () => {
    if (!newKill.player_name) return;
    setLoading(true);
    const res = await upsertKill({ ...newKill, tournament_id: tournamentId });
    if (res.success) {
      setKillsData([...killsData, { ...newKill, id: res.id }]);
      setNewKill({ player_name: '', team_name: '', kills: 0 });
    }
    setLoading(false);
  };

  const handleDeleteStanding = async (id: string) => {
    await deleteStanding(id);
    setStandingsData(standingsData.filter((s: any) => s.id !== id));
  };

  const handleDeleteKill = async (id: string) => {
    await deleteKill(id);
    setKillsData(killsData.filter((k: any) => k.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('standings')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab==='standings'?'bg-red-600 text-white':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Trophy className="w-4 h-4 inline mr-2" />Team Points
        </button>
        <button onClick={() => setActiveTab('kills')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab==='kills'?'bg-red-600 text-white':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Crosshair className="w-4 h-4 inline mr-2" />Most Kills
        </button>
      </div>

      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4">
            <h3 className="font-black text-white mb-4 text-sm uppercase tracking-wider">Add / Update Standing</h3>
            <div className="grid grid-cols-3 gap-3">
              <input value={newStanding.team_name} onChange={e => setNewStanding({...newStanding, team_name: e.target.value})} placeholder="Team Name" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
              <input type="number" value={newStanding.kills} onChange={e => setNewStanding({...newStanding, kills: +e.target.value})} placeholder="Kills" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
              <input type="number" value={newStanding.points} onChange={e => setNewStanding({...newStanding, points: +e.target.value})} placeholder="Points" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <button onClick={handleAddStanding} disabled={loading} className="mt-3 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
              <Plus className="w-4 h-4" /> Add Standing
            </button>
          </div>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th className="text-left p-4 text-gray-500 uppercase text-xs">Team</th><th className="text-center p-4 text-gray-500 uppercase text-xs">Kills</th><th className="text-center p-4 text-gray-500 uppercase text-xs">Points</th><th className="p-4"></th></tr></thead>
              <tbody>
                {standingsData.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500 text-sm">No standings yet</td></tr>}
                {standingsData.map((row: any, i: number) => (
                  <tr key={row.id || i} className="border-b border-white/5">
                    <td className="p-4 font-bold text-white">{row.team_name}</td>
                    <td className="p-4 text-center text-gray-300">{row.kills}</td>
                    <td className="p-4 text-center font-black text-red-400">{row.points}</td>
                    <td className="p-4 text-right"><button onClick={() => handleDeleteStanding(row.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'kills' && (
        <div className="space-y-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-4">
            <h3 className="font-black text-white mb-4 text-sm uppercase tracking-wider">Add / Update MVP Kill Record</h3>
            <div className="grid grid-cols-3 gap-3">
              <input value={newKill.player_name} onChange={e => setNewKill({...newKill, player_name: e.target.value})} placeholder="Player Name" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
              <input value={newKill.team_name} onChange={e => setNewKill({...newKill, team_name: e.target.value})} placeholder="Team Name" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
              <input type="number" value={newKill.kills} onChange={e => setNewKill({...newKill, kills: +e.target.value})} placeholder="Kills" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <button onClick={handleAddKill} disabled={loading} className="mt-3 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th className="text-left p-4 text-gray-500 uppercase text-xs">Player</th><th className="text-left p-4 text-gray-500 uppercase text-xs">Team</th><th className="text-center p-4 text-gray-500 uppercase text-xs">Kills</th><th className="p-4"></th></tr></thead>
              <tbody>
                {killsData.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500 text-sm">No kill records yet</td></tr>}
                {killsData.map((row: any, i: number) => (
                  <tr key={row.id || i} className="border-b border-white/5">
                    <td className="p-4 font-bold text-white">{row.player_name}</td>
                    <td className="p-4 text-gray-400">{row.team_name}</td>
                    <td className="p-4 text-center font-black text-red-400">{row.kills}</td>
                    <td className="p-4 text-right"><button onClick={() => handleDeleteKill(row.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
