'use client'

import { useState } from 'react'
import { Trophy, Crosshair, Plus, Trash2, Users, User, Shield } from 'lucide-react'
import { upsertStanding, upsertKill, deleteStanding, deleteKill } from '@/actions/admin-standings'

export default function StandingsEditor({ standings, kills, teams = [], tournamentId }: any) {
  const [activeTab, setActiveTab] = useState<'standings' | 'kills'>('standings')
  const [standingsData, setStandingsData] = useState(standings)
  const [killsData, setKillsData] = useState(kills)
  const [loading, setLoading] = useState(false)

  // Team Standing Form
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [newStanding, setNewStanding] = useState({ team_name: '', kills: 0, points: 0 })

  // MVP Kill Form
  const [selectedPlayerKey, setSelectedPlayerKey] = useState('')
  const [newKill, setNewKill] = useState({ player_name: '', team_name: '', kills: 0 })

  // Extract all registered players across all teams
  const allPlayers: Array<{ player_name: string; team_name: string; role: string }> = []
  teams.forEach((t: any) => {
    if (t.leader_name) {
      allPlayers.push({ player_name: t.leader_name, team_name: t.team_name, role: 'Captain' })
    }
    if (t.players && Array.isArray(t.players)) {
      t.players.forEach((p: any) => {
        if (p.player_name && p.player_name !== t.leader_name) {
          allPlayers.push({ player_name: p.player_name, team_name: t.team_name, role: p.player_type || 'Member' })
        }
      })
    }
  })

  const handleSelectTeam = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = e.target.value
    setSelectedTeamId(teamId)
    if (teamId === 'custom' || !teamId) {
      setNewStanding(prev => ({ ...prev, team_name: '' }))
    } else {
      const found = teams.find((t: any) => t.id === teamId)
      if (found) {
        setNewStanding(prev => ({ ...prev, team_name: found.team_name }))
      }
    }
  }

  const handleSelectPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value
    setSelectedPlayerKey(key)
    if (key === 'custom' || !key) {
      setNewKill(prev => ({ ...prev, player_name: '', team_name: '' }))
    } else {
      const [pName, tName] = key.split('::')
      setNewKill(prev => ({ ...prev, player_name: pName || '', team_name: tName || '' }))
    }
  }

  const handleAddStanding = async () => {
    if (!newStanding.team_name) return
    setLoading(true)
    const res = await upsertStanding({ ...newStanding, tournament_id: tournamentId })
    if (res.success) {
      setStandingsData([...standingsData, { ...newStanding, id: res.id }])
      setNewStanding({ team_name: '', kills: 0, points: 0 })
      setSelectedTeamId('')
    }
    setLoading(false)
  }

  const handleAddKill = async () => {
    if (!newKill.player_name) return
    setLoading(true)
    const res = await upsertKill({ ...newKill, tournament_id: tournamentId })
    if (res.success) {
      setKillsData([...killsData, { ...newKill, id: res.id }])
      setNewKill({ player_name: '', team_name: '', kills: 0 })
      setSelectedPlayerKey('')
    }
    setLoading(false)
  }

  const handleDeleteStanding = async (id: string) => {
    await deleteStanding(id)
    setStandingsData(standingsData.filter((s: any) => s.id !== id))
  }

  const handleDeleteKill = async (id: string) => {
    await deleteKill(id)
    setKillsData(killsData.filter((k: any) => k.id !== id))
  }

  const inputCls = 'bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#DC2626] outline-none transition-colors w-full'

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'standings' ? 'bg-[#DC2626] text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-2" /> Team Points Table
        </button>
        <button
          onClick={() => setActiveTab('kills')}
          className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'kills' ? 'bg-[#DC2626] text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Crosshair className="w-4 h-4 inline mr-2" /> MVP Most Kills
        </button>
      </div>

      {/* TEAM STANDINGS TAB */}
      {activeTab === 'standings' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" /> Add / Update Team Standing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Select Registered Team</label>
                <select
                  value={selectedTeamId}
                  onChange={handleSelectTeam}
                  className={inputCls + ' cursor-pointer'}
                >
                  <option value="">-- Choose Registered Team --</option>
                  {teams.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.team_name} ({t.team_code})
                    </option>
                  ))}
                  <option value="custom">✏️ Type Custom Team Name...</option>
                </select>
              </div>

              {(selectedTeamId === 'custom' || !selectedTeamId) && (
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Team Name</label>
                  <input
                    value={newStanding.team_name}
                    onChange={e => setNewStanding({ ...newStanding, team_name: e.target.value })}
                    placeholder="e.g. Educated Gamer"
                    className={inputCls}
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Kill Points</label>
                <input
                  type="number"
                  min={0}
                  value={newStanding.kills}
                  onChange={e => setNewStanding({ ...newStanding, kills: +e.target.value })}
                  placeholder="Kills"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Total Points</label>
                <input
                  type="number"
                  min={0}
                  value={newStanding.points}
                  onChange={e => setNewStanding({ ...newStanding, points: +e.target.value })}
                  placeholder="Points"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              onClick={handleAddStanding}
              disabled={loading || !newStanding.team_name}
              className="flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Save Team Standing
            </button>
          </div>

          {/* Standings List Table */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 text-gray-400 font-bold uppercase text-xs">Rank</th>
                  <th className="text-left p-4 text-gray-400 font-bold uppercase text-xs">Team</th>
                  <th className="text-center p-4 text-gray-400 font-bold uppercase text-xs">Kills</th>
                  <th className="text-center p-4 text-gray-400 font-bold uppercase text-xs">Total Points</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {standingsData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 italic text-sm">
                      No team standings recorded yet. Select a team above to get started.
                    </td>
                  </tr>
                )}
                {standingsData.map((row: any, i: number) => (
                  <tr key={row.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-black text-gray-400">#{i + 1}</td>
                    <td className="p-4 font-bold text-white text-base">{row.team_name}</td>
                    <td className="p-4 text-center text-gray-300 font-mono">{row.kills}</td>
                    <td className="p-4 text-center font-black text-[#DC2626] font-mono text-lg">{row.points}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteStanding(row.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Standing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MVP KILLS TAB */}
      {activeTab === 'kills' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#DC2626]" /> Add / Update MVP Player Kills
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Select Registered Player</label>
                <select
                  value={selectedPlayerKey}
                  onChange={handleSelectPlayer}
                  className={inputCls + ' cursor-pointer'}
                >
                  <option value="">-- Choose Registered Player --</option>
                  {allPlayers.map((p, idx) => (
                    <option key={idx} value={`${p.player_name}::${p.team_name}`}>
                      {p.player_name} ({p.team_name} — {p.role})
                    </option>
                  ))}
                  <option value="custom">✏️ Type Custom Player / Team...</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Player Name</label>
                <input
                  value={newKill.player_name}
                  onChange={e => setNewKill({ ...newKill, player_name: e.target.value })}
                  placeholder="Player Name"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Team Name</label>
                <input
                  value={newKill.team_name}
                  onChange={e => setNewKill({ ...newKill, team_name: e.target.value })}
                  placeholder="Team Name"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-400 mb-1">Total Kills</label>
                <input
                  type="number"
                  min={0}
                  value={newKill.kills}
                  onChange={e => setNewKill({ ...newKill, kills: +e.target.value })}
                  placeholder="Kills"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              onClick={handleAddKill}
              disabled={loading || !newKill.player_name}
              className="flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Save MVP Kill Record
            </button>
          </div>

          {/* Kills List Table */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 text-gray-400 font-bold uppercase text-xs">Rank</th>
                  <th className="text-left p-4 text-gray-400 font-bold uppercase text-xs">Player</th>
                  <th className="text-left p-4 text-gray-400 font-bold uppercase text-xs">Team</th>
                  <th className="text-center p-4 text-gray-400 font-bold uppercase text-xs">Kills</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {killsData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 italic text-sm">
                      No MVP kill records added yet. Select a player above to add kill stats.
                    </td>
                  </tr>
                )}
                {killsData.map((row: any, i: number) => (
                  <tr key={row.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-black text-gray-400">#{i + 1}</td>
                    <td className="p-4 font-bold text-white text-base">{row.player_name}</td>
                    <td className="p-4 text-gray-300">{row.team_name}</td>
                    <td className="p-4 text-center font-black text-[#DC2626] font-mono text-lg">{row.kills}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteKill(row.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete MVP Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
