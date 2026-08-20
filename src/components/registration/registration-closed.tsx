'use client'

import { Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  maxTeams: number
  registeredCount: number
}

export function RegistrationClosed({ maxTeams, registeredCount }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center space-y-6"
    >
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
        <Shield className="w-12 h-12 text-red-500" />
      </div>
      
      <h2 className="text-4xl font-black text-white tracking-wider">
        REGISTRATION CLOSED
      </h2>
      
      <div className="bg-[#DC2626]/10 text-[#DC2626] font-bold py-2 px-6 rounded-full border border-[#DC2626]/30">
        {Math.min(registeredCount, maxTeams)} / {maxTeams} TEAMS REGISTERED
      </div>
      
      <p className="text-gray-400 max-w-md">
        All tournament slots have been filled. Stay tuned for future tournaments!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link 
          href="/teams"
          className={cn(
            buttonVariants({ variant: 'default' }),
            "bg-[#DC2626] hover:bg-[#7C3AED] text-white"
          )}
        >
          VIEW TEAMS
        </Link>
        <Link 
          href="https://discord.gg/bE2Cta8q" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            "border-gray-700 text-gray-300 hover:text-white"
          )}
        >
          JOIN DISCORD
        </Link>
      </div>
    </motion.div>
  )
}
