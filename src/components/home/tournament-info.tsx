'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, CalendarClock, Crosshair, Map as MapIcon, Info, Trophy, Target, Ticket, ScrollText, Gamepad2 } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function TournamentInfo({ tournament, settings }: { tournament: any, settings: any }) {
  const scheduleItems = [
    { icon: Calendar, label: 'Tournament Date', value: tournament?.date ? formatDate(tournament.date) : 'TBD' },
    { icon: Clock, label: 'Tournament Time', value: tournament?.time ? formatTime(tournament.time) : 'TBD' },
    { icon: CalendarClock, label: 'Registration Deadline', value: tournament?.registration_deadline ? formatDate(tournament.registration_deadline) : 'TBD' },
    { icon: Info, label: 'Room Info', value: settings?.custom_room_info || 'TBD' },
  ];

  const gameItems = [
    { icon: Crosshair, label: 'Game Mode', value: 'Battle Royale (Squad)' },
    { icon: MapIcon, label: 'Maps (5-Map Rotation)', value: 'Bermuda, Purgatory, Kalahari, Solara, NexTerra' },
  ];

  const prizeItems = [
    { icon: Ticket, label: 'Entry Fee', value: '100 Rs', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: Trophy, label: 'Winner Prize', value: '1500 Rs', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: true },
    { icon: Target, label: 'Most Kills (MVP)', value: '100 Rs', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="relative mt-24 max-w-6xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-[#DC2626]/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase font-heading flex items-center gap-4">
            <span className="w-3 h-12 bg-gradient-to-b from-[#DC2626] to-[#EF4444] rounded-sm inline-block shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            Tournament <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 ml-2">Dossier</span>
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-3 ml-7">
            Official briefing & specifications
          </p>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column - Schedule & Specs */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div variants={itemVariants} className="bg-[#050507]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
              <ScrollText className="w-5 h-5 text-gray-400" />
              Schedule & Logistics
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {scheduleItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex shrink-0 items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="font-bold text-white text-sm md:text-base leading-tight">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-[1px] bg-white/10 my-8" />

            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-gray-400" />
              Game Settings
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {gameItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex shrink-0 items-center justify-center text-gray-400 group-hover:text-[#DC2626] transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="font-black text-white text-lg uppercase tracking-wider">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Prize Pool & Fees */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#0a0a0f] to-[#050507] backdrop-blur-xl border border-[#DC2626]/20 rounded-2xl p-8 relative overflow-hidden group hover:border-[#DC2626]/40 transition-colors shadow-[0_0_40px_rgba(239,68,68,0.05)] h-full flex flex-col">
            <div className="absolute top-0 right-0 w-full h-64 bg-[#DC2626]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-8 italic">
              Rewards & Fees
            </h3>
            
            <div className="space-y-4 flex-1">
              {prizeItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "relative overflow-hidden rounded-xl p-5 border flex items-center justify-between transition-all duration-300 hover:scale-[1.02]",
                    item.bg, item.border
                  )}
                >
                  {item.glow && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 -translate-x-full animate-[shimmer_2s_infinite]" />
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn("p-2.5 rounded-lg bg-black/40 border border-black/50 shadow-inner", item.color)}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-300 text-sm uppercase tracking-wider">{item.label}</span>
                  </div>
                  <div className={cn("text-2xl font-black drop-shadow-md relative z-10", item.color)}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DC2626]" />
              <p className="text-xs text-gray-400 font-bold leading-relaxed ml-2 uppercase tracking-wide">
                <span className="text-white">Note:</span> Prize distribution will be handled via EasyPaisa / JazzCash / Bank Transfer immediately after match verification.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
