'use client';

import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Swords, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Register Team",
      desc: "Pay 100 Rs entry fee and register your squad of 4 players.",
    },
    {
      icon: ShieldCheck,
      title: "2. Get Verified",
      desc: "Admins will verify your payment and slot. Only 12 teams allowed!",
    },
    {
      icon: Swords,
      title: "3. Join Custom Room",
      desc: "Get ID/Pass on Discord. Drop into Bermuda and fight for survival.",
    },
    {
      icon: Trophy,
      title: "4. Claim Reward",
      desc: "Win 1500 Rs for 1st Place or get 100 Rs for Most Kills (MVP)!",
    }
  ];

  return (
    <section className="relative py-24 border-t border-white/5 bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-[url('/hero_bg.jpg')] opacity-5 bg-cover bg-center mix-blend-overlay" />
      <div className="container relative z-10 mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase font-heading">
            How to <span className="text-[#DC2626]">Compete</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto uppercase tracking-widest text-sm font-bold">
            The path to becoming the Educated Gamer Champion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DC2626]/20 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 bg-black/60 backdrop-blur-xl border border-[#DC2626]/20 p-8 rounded-2xl text-center group hover:border-[#DC2626]/80 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.05)] hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#DC2626] to-[#991b1b] rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-6">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-wide">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/register">
            <button className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-black italic text-xl px-12 py-5 rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] hover:scale-105 transition-all duration-300">
              SECURE YOUR SLOT NOW
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
