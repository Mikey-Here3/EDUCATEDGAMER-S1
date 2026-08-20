'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { updateSettings } from '@/actions/admin-settings'
import { TOURNAMENT_ID } from '@/lib/constants'

export default function SettingsForm({ tournament }: { tournament: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: tournament?.status || 'upcoming',
    registration_open: tournament?.registration_open ?? true,
    prize_pool: tournament?.prize_pool || '1500 Rs',
    map: tournament?.map || 'Bermuda',
    game_mode: tournament?.game_mode || 'Battle Royale',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await updateSettings(TOURNAMENT_ID, formData)
      if (res.success) {
        alert('Tournament updated successfully!')
      } else {
        alert('Failed: ' + res.error)
      }
    } catch (error) {
      alert('Failed to update tournament')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-300">Tournament Status</Label>
        <select 
          className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="announced">Announced</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Prize Pool / Winner Prize</Label>
        <Input 
          className="bg-black/50 border-white/10 text-white"
          value={formData.prize_pool}
          onChange={(e) => setFormData({...formData, prize_pool: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Map</Label>
        <Input 
          className="bg-black/50 border-white/10 text-white"
          value={formData.map}
          onChange={(e) => setFormData({...formData, map: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Game Mode</Label>
        <Input 
          className="bg-black/50 border-white/10 text-white"
          value={formData.game_mode}
          onChange={(e) => setFormData({...formData, game_mode: e.target.value})}
        />
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
        <Switch 
          checked={formData.registration_open}
          onCheckedChange={(checked) => setFormData({...formData, registration_open: checked})}
        />
        <Label className="text-white font-bold">Registration Open</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-purple-700 text-white">
        {isLoading ? 'Saving...' : 'Update Tournament'}
      </Button>
    </form>
  )
}
