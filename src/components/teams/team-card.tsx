'use client'

import { motion } from 'framer-motion'
import { Team } from '@/types'
import { StatusBadge } from '@/components/shared/status-badge'
import { Crown, User, Shield, Users } from 'lucide-react'
import { useState } from 'react'

interface Props {
  team: any
  index: number
  showPlayers?: boolean
}

export function TeamCard({ team, index, showPlayers = true }: Props) {
  const teamNumber = (index + 1).toString().padStart(2, '0')
  const [imageError, setImageError] = useState(false)
  const teamInitials = team.team_name ? team.team_name.slice(0, 2).toUpperCase() : 'EG'
  const playersList = team.players || team.team_players || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <div className="bg-[#0a0a0f] border border-white/10 hover:border-[#DC2626]/50 rounded-2xl p-6 sm:p-7 shadow-2xl h-full flex flex-col justify-between transition-all duration-300 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC2626]/5 blur-2xl rounded-full pointer-events-none" />

        <div>
          {/* Header Bar */}
          <div className="flex justify-between items-center mb-5">
            <div className="bg-[#DC2626]/15 text-[#DC2626] text-xs font-black px-3.5 py-1 rounded-full border border-[#DC2626]/30 font-mono tracking-wider">
              SLOT #{teamNumber}
            </div>
            <StatusBadge status={team.status} />
          </div>
          
          {/* Team Branding */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {team.logo_url && !imageError ? (
                <img 
                  src={team.logo_url} 
                  alt={team.team_name} 
                  onError={() => setImageError(true)}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 shadow-lg group-hover:border-[#DC2626]/50 transition-colors"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 via-red-950/40 to-black flex items-center justify-center border-2 border-white/10 group-hover:border-[#DC2626]/50 shadow-inner">
                  <span className="font-black text-white text-lg font-mono tracking-wider">{teamInitials}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-wide uppercase font-heading group-hover:text-[#DC2626] transition-colors break-words">
                {team.team_name}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{team.team_code}</p>
            </div>
          </div>
        </div>
        
        {/* Full Roster List */}
        {showPlayers && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-gray-400">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#DC2626]" /> Squad Roster</span>
              <span className="text-gray-500 font-mono">{1 + (playersList.length > 0 ? playersList.length - 1 : 0)} Players</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {/* Captain / Leader */}
              <div className="flex items-center justify-between bg-black/40 border border-white/5 px-3 py-2 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="font-bold text-white truncate max-w-[140px]">{team.leader_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-mono">UID: {team.leader_uid}</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">CAPTAIN</span>
                </div>
              </div>

              {/* Other Squad Players */}
              {playersList.filter((p: any) => p.player_type !== 'leader').map((player: any, pIdx: number) => {
                const isSub = player.player_type === 'substitute'
                return (
                  <div key={player.id || pIdx} className="flex items-center justify-between bg-black/30 border border-white/5 px-3 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <User className={`w-3.5 h-3.5 flex-shrink-0 ${isSub ? 'text-gray-500' : 'text-red-400'}`} />
                      <span className="text-gray-300 font-medium truncate max-w-[140px]">{player.player_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-600 font-mono">UID: {player.free_fire_uid}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        isSub 
                          ? 'bg-white/5 text-gray-400 border border-white/10' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {isSub ? 'SUB' : 'MEMBER'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
