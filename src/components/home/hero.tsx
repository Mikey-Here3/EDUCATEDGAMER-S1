'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Flame, Clock, Shield, PlaySquare, Award } from 'lucide-react';
import Particles from '@/components/shared/particles';
import { cn } from '@/lib/utils';

interface HeroProps {
  tournament: any;
  registeredCount: number;
  maxTeams: number;
  settings: any;
}

export default function Hero({ tournament, registeredCount, maxTeams, settings }: HeroProps) {
  const isClosed = registeredCount >= maxTeams;
  const prizePool = tournament?.prize_pool || '9,000 Diamonds';
  const gameMode = tournament?.game_mode || 'Battle Royale';
  const mapName = tournament?.map || 'Bermuda';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-32 overflow-hidden bg-[#030014] bg-cover bg-center bg-no-repeat bg-[url('/hero_bg.jpg')]">
      {/* Background Particles & Overlays */}
      <div className="absolute inset-0 z-0">
        <Particles />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-20 max-w-6xl w-full mx-auto px-4 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 pb-12">
        <motion.div 
          className="lg:col-span-8 space-y-6 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Prize Pool Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 bg-[#DC2626]/20 text-[#EF4444] border border-[#DC2626]/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" /> {prizePool} Prize Pool
            </span>
          </motion.div>

          {/* Epic Main Heading */}
          <motion.div variants={itemVariants} className="space-y-1">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.85]">
              <span className="text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]">EDUCATED</span>
              <br />
              <span className="text-[#DC2626] drop-shadow-[0_4px_20px_rgba(220,38,38,0.4)]">GAMER</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 font-bold tracking-widest uppercase font-heading">
              Official Free Fire Tournament
            </p>
            
            <div className="inline-block">
              <span className="inline-block px-4 py-1 rounded bg-[#DC2626]/30 border border-[#DC2626] text-xs font-black uppercase tracking-wider text-white">
                Season 1
              </span>
            </div>
            
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 pt-2 leading-relaxed">
              <span className="text-[#EF4444] font-bold">20X REWARD • COMPETE • WIN.</span>
              <br />
              Only 12 teams. Next teams go to <span className="text-white font-bold">WAITING LIST</span>. If a team drops, waiting list plays. <br/>
              <span className="text-[#EF4444] font-bold">Entry Fee:</span> 100 Rs
            </p>
          </motion.div>

          {/* Quick Stats Grid Component */}
          <motion.div 
            variants={itemVariants} 
            className="max-w-xl mx-auto lg:mx-0 grid grid-cols-4 gap-4 p-4 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md"
          >
            <div className="text-center">
              <span className="text-lg md:text-xl font-black text-white block">
                1500 Rs
              </span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                Winner Prize
              </span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-lg md:text-xl font-black text-[#DC2626] block">100 Rs</span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">MVP Kills</span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-lg md:text-xl font-black text-white block">100 Rs</span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Entry Fee</span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-lg md:text-xl font-black text-[#EF4444] block">{maxTeams}</span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Teams Limit</span>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            {isClosed ? (
              <button 
                type="button" 
                disabled 
                className="justify-center font-medium transition-all duration-300 rounded-lg cursor-not-allowed opacity-50 bg-gradient-to-r from-red-600 to-red-800 text-white text-sm px-6 py-3 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Registration Closed
              </button>
            ) : (
              <Link href="/register">
                <button 
                  type="button" 
                  className="justify-center font-medium transition-all duration-300 rounded-lg cursor-pointer bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] text-sm px-6 py-3 flex items-center gap-2"
                >
                  <Award className="w-4 h-4" /> Register Your Team
                </button>
              </Link>
            )}
            
            <Link href="/rules">
              <button 
                type="button" 
                className="justify-center font-medium transition-all duration-300 rounded-lg cursor-pointer bg-transparent border border-white/20 text-[#DC2626] hover:bg-white/5 text-sm px-6 py-3 flex items-center gap-2"
              >
                Rules & Settings
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Live Slot Registration Progress Indicator card on right */}
        <motion.div 
          className="lg:col-span-4 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 font-heading text-center">
              LIVE REGISTRATION SLOTS
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>{registeredCount} / {maxTeams} TEAMS</span>
                <span className="text-[#DC2626]">
                  {isClosed ? 'CLOSED' : `${maxTeams - registeredCount} LEFT`}
                </span>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                <motion.div 
                  className={cn(
                    "h-full rounded-full",
                    isClosed ? "bg-red-600 shadow-[0_0_10px_#ef4444]" : "bg-gradient-to-r from-[#DC2626] to-[#EF4444] shadow-[0_0_10px_#DC2626]"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${(registeredCount / maxTeams) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              
              <div className="text-center pt-2">
                {isClosed ? (
                  <span className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    REGISTRATION CLOSED
                  </span>
                ) : (
                  <span className="text-xs text-green-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    REGISTRATION OPEN
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Live Matches / Fair Play Ticker Banner */}
      <div className="relative z-20 w-full border-t border-white/10 bg-black/75 backdrop-blur-md py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-semibold text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span><strong className="text-white">LIVE STREAM:</strong> WATCH MATCHES ON YOUTUBE</span>
            </div>
            
            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-8">
              <Clock className="w-4 h-4 text-[#DC2626]" />
              <span><strong className="text-white">REAL TIME STANDINGS:</strong> UPDATED LOBBIES</span>
            </div>
            
            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-8">
              <Shield className="w-4 h-4 text-green-500" />
              <span><strong className="text-white">FAIR PLAY POLICY:</strong> MOBILE MATCHES ONLY</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">One Team One Goal</span>
            <span className="px-2 py-0.5 rounded bg-[#DC2626]/20 border border-[#DC2626]/40 text-[9px] font-black text-white tracking-widest uppercase">
              EG
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
