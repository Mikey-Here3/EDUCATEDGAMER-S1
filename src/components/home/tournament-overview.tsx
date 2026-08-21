'use client';
import { motion } from 'framer-motion';
import { Trophy, Target, Ticket, MapPin, Crosshair, ShieldAlert, Gift } from 'lucide-react';
import { TOURNAMENT_MAPS } from '@/lib/constants';

export default function TournamentOverview({ tournament }: { tournament: any }) {
  const prizes = [
    { place: '1st', label: 'BOOYAH Champion', amount: '1000 Rs', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    { place: 'MVP', label: 'Most Kills (Fragger)', amount: '100 Rs', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { place: 'GIVEAWAY', label: 'Supporter Giveaway', amount: '100 Rs', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
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
                <h3 className="text-2xl md:text-3xl font-black text-white">Educated Gamer Championship</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                The ultimate Battle Royale showdown for 12 elite squads. Teams clash in custom limited ammo rooms across <strong className="text-white">5 legendary maps</strong> with live match coverage. Entry fee is 100 PKR! Winner takes 1000 Rs, MVP fragger receives 100 Rs, plus a 100 Rs Giveaway prize!
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">1st Prize</span>
                  <span className="text-[#DC2626] font-black text-base">1000 Rs</span>
                </div>
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">MVP Fragger</span>
                  <span className="text-red-400 font-black text-base">100 Rs</span>
                </div>
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">Giveaway</span>
                  <span className="text-purple-400 font-black text-base">100 Rs</span>
                </div>
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-xl">
                  <span className="text-gray-500 uppercase block tracking-wider font-semibold text-[10px]">Entry Fee</span>
                  <span className="text-white font-black text-base">100 PKR</span>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 p-4 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                  <strong className="text-white uppercase">Slot Confirmation Policy:</strong> Slots are confirmed on a first-come, first-served basis upon receipt verification. Excess entries are automatically queued in the Waiting List.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Cards */}
          <div className="space-y-6">
            {/* Prize Pool Breakdown */}
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.2 }} className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/30 transition-colors shadow-2xl space-y-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2 font-heading">
                <Trophy className="w-5 h-5 text-yellow-400" /> Reward Distributions
              </h3>
              <div className="space-y-3">
                {prizes.map((p, i) => (
                  <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border ${p.bg} ${p.border}`}>
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/40 ${p.color}`}>{p.place}</span>
                      <p className="text-xs font-bold text-white mt-1">{p.label}</p>
                    </div>
                    <span className={`font-mono font-black text-lg ${p.color}`}>{p.amount}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Point System */}
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.3 }} className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/30 transition-colors shadow-2xl space-y-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2 font-heading">
                <Crosshair className="w-5 h-5 text-[#DC2626]" /> Official Point Scoring
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {pointSystem.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/40 border border-white/5 px-3 py-2 rounded-lg">
                    <span className="text-gray-400 font-semibold">{item.label}</span>
                    <span className="font-mono font-bold text-[#DC2626]">{item.pts} pts</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
