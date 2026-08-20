'use client';
import { motion } from 'framer-motion';
import { Trophy, Target, Ticket, MapPin, Crosshair, ShieldAlert } from 'lucide-react';
import { TOURNAMENT_MAPS } from '@/lib/constants';

export default function TournamentOverview({ tournament }: { tournament: any }) {
  const prizes = [
    { place: '1st', label: 'BOOYAH Champion', amount: '1500 Rs', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    { place: 'MVP', label: 'Most Kills (Fragger)', amount: '100 Rs', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  ];

  const pointSystem = [
    { label: '1st Place (BOOYAH)', pts: 12 },
    { label: '2nd Position', pts: 10 },
    { label: '3rd Position', pts: 8 },
    { label: '4th Position', pts: 5 },
    { label: '5th Position', pts: 4 },
    { label: '6th Position', pts: 3 },
    { label: '7th Position', pts: 2 },
    { label: '8th Position', pts: 1 },
    { label: 'Per Kill Point', pts: 1 },
  ];

  return (
    <section id="overview" className="py-24 px-4 bg-black/40 relative z-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white font-heading">
            Tournament <span className="text-[#DC2626]">Overview</span>
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Roster setup, 5-Map schedules, and entry payout sequences</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Overview Card */}
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.1 }} className="lg:col-span-2 bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden hover:border-[#DC2626]/30 transition-colors shadow-2xl flex flex-col justify-between">
            {/* Banner */}
            <div className="h-44 bg-gradient-to-br from-red-950 via-black to-black relative flex items-end p-6 border-b border-white/5">
              <div className="absolute inset-0 bg-[url('/hero_bg.jpg')] opacity-20 bg-cover bg-center" />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-black uppercase text-[#DC2626] tracking-widest">Free Fire Mobile Official</span>
                <h3 className="text-2xl md:text-3xl font-black text-white">Educated Gamer 1500 PKR Championship</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                The ultimate Battle Royale showdown for 12 elite squads. Teams clash in custom limited ammo rooms across <strong className="text-white">5 legendary maps</strong> with live match coverage. Entry fee is 100 PKR with 20X overall rewards!
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">Total Prize</span>
                  <span className="text-[#DC2626] font-black text-base">1500+100 Rs</span>
                </div>
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">Entry Fee</span>
                  <span className="text-white font-black text-base">100 PKR</span>
                </div>
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">Format</span>
                  <span className="text-white font-black text-base">Squad (5 Maps)</span>
                </div>
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">Roster Size</span>
                  <span className="text-white font-black text-base">4 + 1 Sub</span>
                </div>
              </div>

              {/* Prize distribution */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Prize Distribution Sequence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prizes.map((p, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${p.bg} ${p.border} flex items-center justify-between`}>
                      <div>
                        <span className="text-xs text-gray-400 font-bold block">{p.place}</span>
                        <span className="text-xs text-white font-black">{p.label}</span>
                      </div>
                      <span className={`font-black text-lg ${p.color}`}>{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5-Map Rotation */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> 5-Map Rotation Series
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TOURNAMENT_MAPS.map((m, idx) => (
                    <div key={idx} className="bg-black/60 border border-white/5 p-2.5 rounded-xl text-center">
                      <p className="font-black text-white text-xs truncate">{m.name}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5 truncate">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Point System */}
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.2 }} className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#DC2626]/30 transition-colors shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                <Crosshair className="w-4 h-4 text-[#DC2626]" /> GvG Point System
              </h3>
              <div className="space-y-2">
                {pointSystem.map((row, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/40 px-3.5 py-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 text-xs font-medium">{row.label}</span>
                    <span className="font-black text-[#DC2626] text-xs font-mono">{row.pts} PTS</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl p-4 text-center space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Schedule Status</p>
              <p className="text-yellow-400 font-black uppercase text-sm">Registrations Active</p>
              <p className="text-[10px] text-gray-500">Lobby codes sent via WhatsApp 15m prior</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
