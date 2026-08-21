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
import { Crown, Phone, Check, X, ShieldAlert, ExternalLink, ImageIcon } from 'lucide-react'

type TeamDetailsModalProps = {
  team: any
  isOpen: boolean
  onClose: () => void
}

function ProofImage({ src, alt, label }: { src?: string | null; alt: string; label: string }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className="bg-black/60 border border-white/10 rounded-xl p-6 text-center space-y-2 flex flex-col items-center justify-center min-h-[160px]">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
          <ImageIcon className="w-5 h-5" />
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        {src ? (
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#DC2626] hover:underline font-mono"
          >
            Open Uploaded URL <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="text-[11px] text-gray-500 italic">No image uploaded</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/60 group">
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="w-full h-full object-contain"
        />
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-black text-white uppercase tracking-widest gap-2 transition-opacity"
        >
          <span>View High-Res Image</span>
          <ExternalLink className="w-4 h-4 text-[#DC2626]" />
        </a>
      </div>
    </div>
  )
}

export default function TeamDetailsModal({ team, isOpen, onClose }: TeamDetailsModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [logoError, setLogoError] = useState(false)

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
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 text-white shadow-2xl p-6 sm:p-8">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 via-black to-black border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
              {team.logo_url && !logoError ? (
                <img
                  src={team.logo_url}
                  alt="Logo"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-black text-white text-lg font-mono tracking-wider">{teamInitials}</span>
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl sm:text-3xl font-black uppercase text-white font-heading">
                {team.team_name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs mt-1 font-mono">
                Code: <strong className="text-white">{team.team_code}</strong> • Registered: {new Date(team.created_at).toLocaleDateString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Contact & Status Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#DC2626]" /> Contact Details
            </h4>
            <p className="text-white"><strong className="text-gray-400">WhatsApp:</strong> {team.whatsapp || team.whatsapp_number}</p>
            <p className="text-white"><strong className="text-gray-400">Email/Discord:</strong> {team.discord || team.discord_id || 'N/A'}</p>
          </div>

          <div className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between text-xs">
            <div>
              <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-2">Review Status</h4>
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                team.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                team.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {team.status || 'pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            <span className="font-bold text-white">Management Action:</span> Review player UIDs and proof receipts below before decision.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleStatusChange('approved')}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] cursor-pointer"
            >
              <Check className="w-4 h-4" /> Approve Squad
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('rejected')}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer"
            >
              <X className="w-4 h-4" /> Reject Squad
            </button>
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
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">
              Captain UID Profile Screenshot
            </h4>
            <ProofImage
              src={team.uid_screenshot_url}
              alt="Captain UID Screenshot"
              label="Captain UID Proof"
            />
          </div>

          <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">
              JazzCash Payment Receipt Screenshot
            </h4>
            <ProofImage
              src={team.payment_proof_url}
              alt="Payment Receipt Screenshot"
              label="JazzCash Payment Proof"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
