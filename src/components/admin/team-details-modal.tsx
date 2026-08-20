'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type TeamDetailsModalProps = {
  team: any
  isOpen: boolean
  onClose: () => void
}

export default function TeamDetailsModal({ team, isOpen, onClose }: TeamDetailsModalProps) {
  if (!team) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team Details: {team.team_name}</DialogTitle>
          <DialogDescription>
            Registration Date: {new Date(team.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h4 className="font-semibold mb-2">Contact Info</h4>
            <p className="text-sm">WhatsApp: {team.whatsapp_number}</p>
            <p className="text-sm">Discord: {team.discord_id || 'N/A'}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Status</h4>
            <p className="text-sm uppercase font-bold">{team.status || 'pending'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Players</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>In-Game Name</TableHead>
                <TableHead>UID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.players?.map((player: any) => (
                <TableRow key={player.id}>
                  <TableCell className="capitalize">{player.role}</TableCell>
                  <TableCell>{player.in_game_name}</TableCell>
                  <TableCell>{player.uid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
