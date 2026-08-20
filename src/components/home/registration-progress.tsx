'use client';

import { motion } from 'framer-motion';
import GlowCard from '@/components/shared/glow-card';

interface RegistrationProgressProps {
  registered: number;
  maxTeams: number;
}

export default function RegistrationProgress({ registered, maxTeams }: RegistrationProgressProps) {
  const percentage = Math.min(100, Math.round((registered / maxTeams) * 100));
  const isClosed = registered >= maxTeams;
  const slotsLeft = maxTeams - registered;

  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-red-400 tracking-wider">REGISTRATION STATUS</h3>
        <div className="flex items-center gap-2">
          {isClosed ? (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-white font-medium">{registered} / {maxTeams} TEAMS REGISTERED</span>
          <span className="text-muted-foreground">{percentage}%</span>
        </div>

        <div className="h-2 w-full bg-[#111115] rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)] rounded-full"
          />
        </div>

        <div className="text-center text-xs text-muted-foreground font-medium">
          {isClosed ? (
            <span className="text-red-400">REGISTRATION CLOSED</span>
          ) : (
            <span>{slotsLeft} SLOTS LEFT</span>
          )}
        </div>
      </div>
    </GlowCard>
  );
}
