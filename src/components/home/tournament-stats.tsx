'use client';

import { motion } from 'framer-motion';
import { Users, User, Globe, Gamepad2, Key, Radio } from 'lucide-react';

export default function TournamentStats({ tournament }: { tournament: any }) {
  const stats = [
    { icon: Users, value: tournament?.max_teams || 12, label: 'TEAMS' },
    { icon: User, value: tournament?.team_size || 4, label: 'PLAYERS PER TEAM' },
    { icon: Globe, value: 'ONLINE', label: 'TOURNAMENT' },
    { icon: Gamepad2, value: 'FREE FIRE', label: 'GAME' },
    { icon: Key, value: 'CUSTOM', label: 'ROOM' },
    { icon: Radio, value: 'LIVE', label: 'BROADCAST' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.05 }}
          className="relative group cursor-default perspective-1000"
        >
          {/* Neon Glow Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#DC2626]/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          
          <div className="relative h-full bg-[#050507]/80 backdrop-blur-xl border border-white/5 group-hover:border-[#DC2626]/50 rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden transition-all duration-500 shadow-xl group-hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)] group-hover:bg-[#0a0a0f]/90">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-[#DC2626] to-transparent opacity-50 group-hover:opacity-100 group-hover:w-full transition-all duration-700" />
            
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-[#DC2626]/40 transition-all duration-500 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] mb-4">
              <stat.icon className="w-6 h-6 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            </div>
            
            <div className="font-black text-2xl text-white tracking-tight mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#EF4444] transition-all duration-300">
              {stat.value}
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-[0.25em] group-hover:text-gray-300 transition-colors duration-300">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
