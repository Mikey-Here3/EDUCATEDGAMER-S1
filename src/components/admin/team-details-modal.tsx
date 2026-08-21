'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { updateTeamStatus } from '@/actions/admin-teams'
import { Crown, Phone, Check, X, ShieldAlert } from 'lucide-react'

type TeamDetailsModalProps = {
  team: any
  isOpen: boolean
  onClose: () => void
}

export default function TeamDetailsModal({ team, isOpen, onClose }: TeamDetailsModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  if (!team) return null

  const playersList = team.players || team.team_players || []
  const teamInitials = team.team_name ? team.team_name.slice(0, 2).toUpperCase() : 'EG'

  const handleStatusChange = (status: 'approved' | 'rejected') => {
    setError('')
    startTransition(async () => {
      const res = await updateTeamStatus(team.id, status)
      if (res.success) {
        router.refresh()
        onClose()
      } else {
        setError(res.error || 'Failed to update team status.')
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 text-white shadow-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-black border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {team.logo_url ? (
                <img src={team.logo_url} alt="Logo" className="w-full h-full object-cover aspect-square" />
              ) : (
                <span className="font-black text-white text-base font-mono">{teamInitials}</span>
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase text-white font-heading">
                {team.team_name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs mt-0.5 font-mono">
                Code: {team.team_code} • Registered: {new Date(team.created_at).toLocaleDateString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Contact & Status Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#DC2626]" /> Contact Details
            </h4>
            <p className="text-white"><strong className="text-gray-400">WhatsApp:</strong> {team.whatsapp || team.whatsapp_number}</p>
            <p className="text-white"><strong className="text-gray-400">Email/Discord:</strong> {team.discord || team.discord_id || 'N/A'}</p>
          </div>

          <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between text-xs">
            <div>
              <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-2">Review Status</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                team.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                team.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {team.status || 'pending'}
              </span>
            </div>

            {/* Quick Action Buttons inside modal */}
            {team.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleStatusChange('approved')}
                  disabled={isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Approve Team
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Reject Team
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          <h4 className="font-black text-white uppercase tracking-wider text-xs flex items-center gap-2">
            Squad Roster ({playersList.length} Registered)
          </h4>
          <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 text-xs font-bold uppercase">Role</TableHead>
                  <TableHead className="text-gray-400 text-xs font-bold uppercase">Player Name</TableHead>
                  <TableHead className="text-gray-400 text-xs font-bold uppercase">Free Fire UID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Captain row */}
                <TableRow className="border-white/5 bg-yellow-500/5">
                  <TableCell className="font-bold text-yellow-400 text-xs flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" /> Captain
                  </TableCell>
                  <TableCell className="text-white font-bold text-xs">{team.leader_name}</TableCell>
                  <TableCell className="text-gray-300 font-mono text-xs">{team.leader_uid}</TableCell>
                </TableRow>
                
                {/* Squad Members */}
                {playersList.filter((p: any) => p.player_type !== 'leader').map((player: any, idx: number) => {
                  const isSub = player.player_type === 'substitute'
                  return (
                    <TableRow key={player.id || idx} className="border-white/5">
                      <TableCell className={`text-xs font-bold ${isSub ? 'text-gray-500' : 'text-red-400'}`}>
                        {isSub ? 'Substitute' : 'Player'}
                      </TableCell>
                      <TableCell className="text-white text-xs">{player.player_name || player.in_game_name}</TableCell>
                      <TableCell className="text-gray-300 font-mono text-xs">{player.free_fire_uid || player.uid}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Proof Verification Screenshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-1">
              Captain UID Screenshot
            </h4>
            {team.uid_screenshot_url ? (
              <a href={team.uid_screenshot_url} target="_blank" rel="noreferrer" className="block relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 hover:border-[#DC2626]/50 transition-all">
                <img src={team.uid_screenshot_url} alt="UID Proof" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-xs font-bold text-white transition-opacity">
                  View Full Image ↗
                </div>
              </a>
            ) : (
              <p className="text-xs text-gray-500 italic">No UID screenshot uploaded</p>
            )}
          </div>

          <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-1">
              JazzCash Payment Receipt
            </h4>
            {team.payment_proof_url ? (
              <a href={team.payment_proof_url} target="_blank" rel="noreferrer" className="block relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 hover:border-[#DC2626]/50 transition-all">
                <img src={team.payment_proof_url} alt="Payment Proof" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-xs font-bold text-white transition-opacity">
                  View Full Image ↗
                </div>
              </a>
            ) : (
              <p className="text-xs text-gray-500 italic">No payment proof receipt uploaded</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
