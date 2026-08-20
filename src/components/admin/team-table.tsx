'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Check, X, Trash2 } from 'lucide-react'
import TeamDetailsModal from './team-details-modal'
import { updateTeamStatus, deleteTeam } from '@/actions/admin-teams'

export default function TeamTable({ initialTeams }: { initialTeams: any[] }) {
  const [teams, setTeams] = useState(initialTeams)
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateTeamStatus(id, status)
    setTeams(teams.map(t => t.id === id ? { ...t, status } : t))
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      await deleteTeam(id)
      setTeams(teams.filter(t => t.id !== id))
    }
  }

  const openModal = (team: any) => {
    setSelectedTeam(team)
    setIsModalOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact (WA)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.id.substring(0, 8)}</TableCell>
              <TableCell>{team.team_name}</TableCell>
              <TableCell>{team.whatsapp_number}</TableCell>
              <TableCell>
                <Badge variant={team.status === 'approved' ? 'default' : team.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {team.status || 'pending'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => openModal(team)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-green-600" onClick={() => handleUpdateStatus(team.id, 'approved')}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-600" onClick={() => handleUpdateStatus(team.id, 'rejected')}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(team.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {teams.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No teams found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {selectedTeam && (
        <TeamDetailsModal 
          team={selectedTeam} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  )
}
