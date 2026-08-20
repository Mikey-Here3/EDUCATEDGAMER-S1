'use client'

import { Team } from '@/types'
import { TeamCard } from './team-card'
import { AnimatePresence } from 'framer-motion'

interface Props {
  teams: Team[]
  showPlayers: boolean
}

export function TeamGrid({ teams, showPlayers }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {teams.map((team, index) => (
          <TeamCard 
            key={team.id} 
            team={team} 
            index={index} 
            showPlayers={showPlayers} 
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
