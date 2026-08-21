'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Users, Shield, User, ChevronDown, ChevronUp } from 'lucide-react'

function TeamCard({ team, index }: { team: any; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const playersList = team.players || []
  const totalPlayers = playersList.length
  const teamInitials = team.team_name?.slice(0, 2).toUpperCase() || 'EG'
  const slotNum = (index + 1).toString().padStart(2, '0')

  const statusConfig: Record<string, { label: string; cls: string }> = {
    approved: { label: '✓ VERIFIED', cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
    pending:  { label: '⏳ PENDING', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  }
  const status = statusConfig[team.status] || statusConfig.pending

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative"
    >
      {/* Slot number watermark */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#DC2626] rounded-xl flex items-center justify-center text-white font-black text-xs font-mono z-10 shadow-lg shadow-red-900/30">
        {slotNum}
      </div>

      <div className="bg-[#0a0a0f] border border-white/8 hover:border-[#DC2626]/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.1)] h-full">
        {/* Top red accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-[#DC2626]/60 via-[#DC2626] to-[#DC2626]/60" />

        <div className="p-5">
          {/* Team Header */}
          <div className="flex items-center gap-4 mb-4">
            {/* Logo */}
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-gradient-to-br from-red-900/30 to-black flex items-center justify-center">
              {team.logo_url && !imageError ? (
                <img
                  src={team.logo_url}
                  alt={team.team_name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-black text-white text-xl font-mono">{teamInitials}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-black text-white uppercase tracking-wide text-base truncate font-heading group-hover:text-[#DC2626] transition-colors">
                {team.team_name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-gray-500 font-mono text-[10px]">{team.team_code}</span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.cls}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Captain Row */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-3 py-2.5 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
              <span className="text-white font-bold text-xs truncate max-w-[120px]">{team.leader_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-mono text-[10px]">UID: {team.leader_uid}</span>
              <span className="text-[9px] font-black uppercase text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded">CAP</span>
            </div>
          </div>

          {/* Player count + expand button */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-gray-400 hover:text-white transition-colors group/btn"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>{totalPlayers} Players Registered (max 7)</span>
            </div>
            {expanded
              ? <ChevronUp className="w-4 h-4 group-hover/btn:text-[#DC2626] transition-colors" />
              : <ChevronDown className="w-4 h-4 group-hover/btn:text-[#DC2626] transition-colors" />
            }
          </button>

          {/* Expanded member list */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-1.5">
                  {playersList.filter((p: any) => p.player_type !== 'leader').map((player: any, pIdx: number) => {
                    const isSub = player.player_type === 'substitute'
                    return (
                      <div key={player.id || pIdx} className="flex items-center justify-between bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <User className={`w-3 h-3 flex-shrink-0 ${isSub ? 'text-gray-500' : 'text-red-400'}`} />
                          <span className={`font-medium truncate max-w-[120px] ${isSub ? 'text-gray-400' : 'text-white'}`}>
                            {player.player_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-600 font-mono text-[10px]">UID: {player.free_fire_uid}</span>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${
                            isSub ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {isSub ? 'SUB' : 'P'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export function TeamsShowcase({ teams }: { teams: any[] }) {
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')

  const filtered = filter === 'all' ? teams : teams.filter(t => t.status === filter)

  return (
    <div className="container mx-auto px-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {[
          { key: 'all', label: `All Teams (${teams.length})` },
          { key: 'approved', label: `✓ Verified (${teams.filter(t => t.status === 'approved').length})` },
          { key: 'pending', label: `⏳ Pending (${teams.filter(t => t.status === 'pending').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
              filter === tab.key
                ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'bg-[#0a0a0f] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-bold">No teams in this category yet.</p>
        </div>
      )}
    </div>
  )
}
