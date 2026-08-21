'use client';
import { useState } from 'react';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { upsertWinner, deleteWinner } from '@/actions/admin-winners';

export default function WinnersEditor({ winners, tournamentId }: any) {
  const [data, setData] = useState(winners);
  const [form, setForm] = useState({ position: '1st', team_name: '', prize: '1000 Rs' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!form.team_name) return;
    setLoading(true);
    const res = await upsertWinner({ ...form, tournament_id: tournamentId });
    if (res.success) setData([...data, { ...form, id: res.id }]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await deleteWinner(id);
    setData(data.filter((w: any) => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-5 space-y-4">
        <h3 className="font-black text-white text-sm uppercase tracking-wider">Add Winner</h3>
        <div className="grid grid-cols-3 gap-3">
          <select value={form.position} onChange={e=>setForm({...form,position:e.target.value})} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option>1st</option><option>2nd</option><option>3rd</option><option>MVP</option><option>Giveaway</option>
          </select>
          <input value={form.team_name} onChange={e=>setForm({...form,team_name:e.target.value})} placeholder="Team Name" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
          <input value={form.prize} onChange={e=>setForm({...form,prize:e.target.value})} placeholder="Prize" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <button onClick={handleAdd} disabled={loading} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add Winner
        </button>
      </div>
      <div className="bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/10"><th className="text-left p-4 text-gray-500 uppercase text-xs">Position</th><th className="text-left p-4 text-gray-500 uppercase text-xs">Team</th><th className="text-left p-4 text-gray-500 uppercase text-xs">Prize</th><th className="p-4"></th></tr></thead>
          <tbody>
            {data.length===0&&<tr><td colSpan={4} className="p-8 text-center text-gray-500">No winners set yet</td></tr>}
            {data.map((w: any, i: number)=>(
              <tr key={w.id||i} className="border-b border-white/5">
                <td className="p-4 font-black text-yellow-400">{w.position}</td>
                <td className="p-4 font-bold text-white">{w.team_name}</td>
                <td className="p-4 text-gray-400">{w.prize}</td>
                <td className="p-4 text-right"><button onClick={()=>handleDelete(w.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
