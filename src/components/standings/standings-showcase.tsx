'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Crosshair, Crown, User, ChevronDown, ChevronUp, Users, Shield, Target, Flame } from 'lucide-react'
import { ensureAbsoluteUrl } from '@/lib/utils'

interface StandingsShowcaseProps {
  initialStandings: any[]
  initialKills: any[]
  teamsMap: Record<string, any>
}

export default function StandingsShowcase({
  initialStandings,
  initialKills,
  teamsMap,
}: StandingsShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'standings' | 'kills'>('standings')
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedTeamId(prev => (prev === id ? null : id))
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* HEADER SECTION */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-red-400">
          <Flame className="w-4 h-4 text-red-500" /> Season 1 Tournament Rankings
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight font-heading">
          <span className="text-white">STANDINGS </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-orange-500">LEADERBOARD</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Official live tournament standings & MVP player kills. Updated after every match round.
        </p>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveTab('standings')}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === 'standings'
              ? 'bg-gradient-to-r from-[#DC2626] to-red-700 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-500/50'
              : 'bg-[#0a0a0f] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-400" /> Team Points Table ({initialStandings.length})
        </button>
        <button
          onClick={() => setActiveTab('kills')}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === 'kills'
              ? 'bg-gradient-to-r from-[#DC2626] to-red-700 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-500/50'
              : 'bg-[#0a0a0f] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}
        >
          <Crosshair className="w-4 h-4 text-red-400" /> Most Kills (MVP) ({initialKills.length})
        </button>
      </div>

      {/* TEAM STANDINGS TABLE */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          {initialStandings.length === 0 ? (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-16 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-heading">No Standings Yet</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Leaderboard points will be updated here once the tournament matches begin. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-[11px] font-black uppercase text-gray-400 tracking-wider">
                      <th className="py-4 px-5">Rank</th>
                      <th className="py-4 px-5">Team</th>
                      <th className="py-4 px-5 text-center">Kill Points</th>
                      <th className="py-4 px-5 text-center">Total Points</th>
                      <th className="py-4 px-5 text-right">Squad Roster</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {initialStandings.map((row: any, idx: number) => {
                      const rank = idx + 1
                      const isExpanded = expandedTeamId === (row.id || `${idx}`)
                      const matchedTeam = teamsMap[row.team_name?.toLowerCase()]
                      const logoUrl = matchedTeam?.logo_url ? ensureAbsoluteUrl(matchedTeam.logo_url) : null
                      const teamInitials = row.team_name ? row.team_name.slice(0, 2).toUpperCase() : 'EG'
                      const players = matchedTeam?.players || []

                      const rankBadges: Record<number, { bg: string; text: string; icon: string }> = {
                        1: { bg: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400', text: '#1 BOOYAH', icon: '👑' },
                        2: { bg: 'bg-slate-300/20 border-slate-300/40 text-slate-200', text: '#2 RUNNER UP', icon: '🥈' },
                        3: { bg: 'bg-amber-700/20 border-amber-700/40 text-amber-500', text: '#3 THIRD', icon: '🥉' },
                      }
                      const rankStyle = rankBadges[rank] || { bg: 'bg-white/5 border-white/10 text-gray-400', text: `#${rank}`, icon: '' }

                      return (
                        <tr key={row.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                          {/* Rank */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <span className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black font-mono text-xs ${rankStyle.bg}`}>
                                {rankStyle.icon ? rankStyle.icon : `#${rank}`}
                              </span>
                            </div>
                          </td>

                          {/* Team Branding */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-900/30 to-black border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                                {logoUrl ? (
                                  <img src={logoUrl} alt={row.team_name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-black text-white font-mono text-sm">{teamInitials}</span>
                                )}
                              </div>
                              <div>
                                <h3 className="font-black text-white text-base tracking-wide uppercase font-heading group-hover:text-[#DC2626] transition-colors">
                                  {row.team_name}
                                </h3>
                                {matchedTeam?.team_code && (
                                  <p className="text-[10px] text-gray-500 font-mono">{matchedTeam.team_code}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Kill Points */}
                          <td className="py-4 px-5 text-center font-mono font-bold text-gray-300 text-base">
                            {row.kills || 0}
                          </td>

                          {/* Total Points */}
                          <td className="py-4 px-5 text-center">
                            <span className="font-black font-mono text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                              {row.points || 0}
                            </span>
                          </td>

                          {/* Sub-menu Dropdown Toggle */}
                          <td className="py-4 px-5 text-right">
                            {matchedTeam ? (
                              <button
                                onClick={() => toggleExpand(row.id || `${idx}`)}
                                className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                              >
                                <span>{isExpanded ? 'Hide Roster' : 'View Roster'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-600 italic">No roster link</span>
                            )}
                          </td>

                          {/* Expandable Sub-menu Roster Row */}
                          {isExpanded && matchedTeam && (
                            <td colSpan={5} className="p-0 border-t border-b border-white/10 bg-black/60">
                              <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#DC2626]" />
                                    <span className="font-black text-white text-xs uppercase tracking-wider">
                                      {row.team_name} — Squad Roster ({players.length + 1} Members)
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  {/* Captain Badge */}
                                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                                        <Crown className="w-3.5 h-3.5" /> Captain
                                      </span>
                                      <span className="text-[9px] bg-yellow-500/20 text-yellow-300 font-mono px-1.5 py-0.5 rounded">
                                        LEADER
                                      </span>
                                    </div>
                                    <p className="font-bold text-white text-sm">{matchedTeam.leader_name}</p>
                                    <p className="text-gray-400 font-mono text-[10px]">UID: {matchedTeam.leader_uid}</p>
                                  </div>

                                  {/* Roster Players */}
                                  {players.filter((p: any) => p.player_type !== 'leader').map((player: any, pIdx: number) => {
                                    const isSub = player.player_type === 'substitute'
                                    return (
                                      <div key={player.id || pIdx} className="bg-black/50 border border-white/5 rounded-xl p-3 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className={`text-[10px] font-black uppercase tracking-wider ${isSub ? 'text-gray-500' : 'text-red-400'}`}>
                                            {isSub ? 'Substitute' : `Player #${pIdx + 2}`}
                                          </span>
                                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isSub ? 'bg-white/5 text-gray-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {isSub ? 'SUB' : 'ROSTER'}
                                          </span>
                                        </div>
                                        <p className="font-bold text-white text-sm">{player.player_name}</p>
                                        <p className="text-gray-400 font-mono text-[10px]">UID: {player.free_fire_uid}</p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOST KILLS (MVP) BOARD */}
      {activeTab === 'kills' && (
        <div className="space-y-4">
          {initialKills.length === 0 ? (
            <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-16 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                🎯
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-heading">No MVP Records Yet</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                MVP top fragger kills will update automatically after each match.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialKills.map((kill: any, idx: number) => {
                const rank = idx + 1
                const matchedTeam = teamsMap[kill.team_name?.toLowerCase()]
                const logoUrl = matchedTeam?.logo_url ? ensureAbsoluteUrl(matchedTeam.logo_url) : null
                const teamInitials = kill.team_name ? kill.team_name.slice(0, 2).toUpperCase() : 'EG'

                return (
                  <motion.div
                    key={kill.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#0a0a0f] border border-white/10 hover:border-[#DC2626]/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group transition-all"
                  >
                    {/* Top rank tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs font-mono flex items-center justify-center border ${
                          rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}>
                          {rank === 1 ? '👑' : `#${rank}`}
                        </span>
                        {rank === 1 && (
                          <span className="text-[10px] font-black uppercase text-yellow-400 tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                            MVP FRAGGER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-[#DC2626] font-black font-mono text-sm">
                        <Target className="w-3.5 h-3.5" />
                        <span>{kill.kills} Kills</span>
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-black border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {logoUrl ? (
                          <img src={logoUrl} alt={kill.team_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-black text-white font-mono text-base">{teamInitials}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-white text-lg tracking-wide uppercase font-heading group-hover:text-[#DC2626] transition-colors">
                          {kill.player_name}
                        </h3>
                        <p className="text-gray-400 text-xs font-bold uppercase mt-0.5">{kill.team_name}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
