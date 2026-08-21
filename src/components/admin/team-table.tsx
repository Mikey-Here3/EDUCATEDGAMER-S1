'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Check, X, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react'
import TeamDetailsModal from './team-details-modal'
import { updateTeamStatus, deleteTeam } from '@/actions/admin-teams'

export default function TeamTable({ initialTeams }: { initialTeams: any[] }) {
  const router = useRouter()
  const [teams, setTeams] = useState(initialTeams)
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'reject' | 'delete'
    team: any | null
  }>({
    isOpen: false,
    type: 'delete',
    team: null,
  })

  const openConfirm = (team: any, type: 'reject' | 'delete') => {
    setConfirmDialog({
      isOpen: true,
      type,
      team,
    })
  }

  const closeConfirm = () => {
    setConfirmDialog({ isOpen: false, type: 'delete', team: null })
  }

  const handleConfirmAction = () => {
    const { type, team } = confirmDialog
    if (!team) return

    startTransition(async () => {
      if (type === 'reject') {
        const res = await updateTeamStatus(team.id, 'rejected')
        if (res.success) {
          setTeams(teams.map(t => t.id === team.id ? { ...t, status: 'rejected' } : t))
          router.refresh()
        }
      } else if (type === 'delete') {
        const res = await deleteTeam(team.id)
        if (res.success) {
          setTeams(teams.filter(t => t.id !== team.id))
          router.refresh()
        }
      }
      closeConfirm()
    })
  }

  const handleApprove = (team: any) => {
    startTransition(async () => {
      const res = await updateTeamStatus(team.id, 'approved')
      if (res.success) {
        setTeams(teams.map(t => t.id === team.id ? { ...t, status: 'approved' } : t))
        router.refresh()
      }
    })
  }

  const openModal = (team: any) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10">
              <TableHead className="text-gray-400 font-bold uppercase text-xs">Code / ID</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-xs">Team Name</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-xs">Captain & WhatsApp</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-xs">Status</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-mono text-white text-xs font-bold">
                  {team.team_code || team.id.substring(0, 8)}
                </TableCell>
                <TableCell className="font-bold text-white text-sm">
                  {team.team_name}
                </TableCell>
                <TableCell className="text-gray-300 text-xs font-mono">
                  <div>{team.leader_name}</div>
                  <div className="text-gray-500 text-[11px]">{team.whatsapp || team.whatsapp_number}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    team.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    team.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {team.status || 'pending'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => openModal(team)}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
                      title="View Details & Proofs"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={isPending}
                      onClick={() => handleApprove(team)}
                      className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-400"
                      title="Approve Team"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={isPending}
                      onClick={() => openConfirm(team, 'reject')}
                      className="bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-400"
                      title="Reject Team"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      disabled={isPending}
                      onClick={() => openConfirm(team, 'delete')}
                      className="bg-red-600/20 border-red-600/40 hover:bg-red-600/40 text-red-400"
                      title="Delete Team Permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {teams.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500 italic">
                  No teams registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <TeamDetailsModal 
          team={selectedTeam} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* Confirmation Dialog for Reject / Delete */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={closeConfirm}>
        <DialogContent className="max-w-md bg-[#0a0a0f] border border-red-500/30 text-white shadow-2xl p-6 rounded-2xl text-center space-y-4">
          <DialogHeader className="flex flex-col items-center justify-center space-y-2">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
              confirmDialog.type === 'delete' 
                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase font-heading text-white tracking-wide">
              {confirmDialog.type === 'delete' ? 'Remove Team Forever?' : 'Confirm Team Rejection?'}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-gray-300 text-sm leading-relaxed">
            {confirmDialog.type === 'delete' ? (
              <>
                Are you sure you want to <strong className="text-red-400">permanently delete</strong> squad{' '}
                <strong className="text-white font-mono">"{confirmDialog.team?.team_name}"</strong> from the database?
                <br />
                <span className="text-xs text-red-400/80 mt-2 block">⚠️ This action CANNOT be undone and deletes all player rosters forever.</span>
              </>
            ) : (
              <>
                Are you sure you want to <strong className="text-amber-400">reject</strong> squad{' '}
                <strong className="text-white font-mono">"{confirmDialog.team?.team_name}"</strong>?
                <br />
                <span className="text-xs text-gray-400 mt-2 block">The team status will be marked as rejected and excluded from public listings.</span>
              </>
            )}
          </DialogDescription>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeConfirm}
              disabled={isPending}
              className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 font-bold uppercase text-xs tracking-wider py-3 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAction}
              disabled={isPending}
              className={`flex-1 font-black uppercase text-xs tracking-widest py-3 rounded-xl shadow-lg transition-all cursor-pointer ${
                confirmDialog.type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/40'
              }`}
            >
              {isPending 
                ? 'Processing...' 
                : confirmDialog.type === 'delete' 
                  ? 'Yes, Remove Forever' 
                  : 'Yes, Reject Team'
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
