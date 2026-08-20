'use client';
import { motion } from 'framer-motion';
import { Shield, Smartphone, Crosshair, Ban, Key, AlertTriangle, DollarSign, Scale } from 'lucide-react';

const RULES = [
  { 
    icon: DollarSign, 
    title: 'Payment Non-Refundable', 
    desc: 'The 100 PKR entry fee is strictly NON-REFUNDABLE under any condition once your squad is registered.' 
  },
  { 
    icon: Scale, 
    title: 'Management Decision is Final', 
    desc: 'The tournament administration decisions regarding points, lobbies, disqualifications, or restarts are 100% final & binding.' 
  },
  { 
    icon: Ban, 
    title: 'Immediate Removal for Misbehavior', 
    desc: 'Zero tolerance for abusive language, toxic conduct, arguing with referees, or misbehaving. Violation results in instant team removal & permanent ban.' 
  },
  { 
    icon: Smartphone, 
    title: 'Mobile Devices Only', 
    desc: 'Only authentic mobile players allowed. Emulators (Bluestacks/LDPlayer/etc.), PC setups, and hardware triggers are strictly prohibited.' 
  },
  { 
    icon: Crosshair, 
    title: '5-Map BR Rotation', 
    desc: 'Competition spans across 5 maps: Bermuda, Purgatory, Kalahari, Solara, NexTerra, and Kalahari under e-sports competitive preset.' 
  },
  { 
    icon: Key, 
    title: 'WhatsApp Lobby Distribution', 
    desc: 'Room ID & password are shared in the official WhatsApp community 15 minutes before the match start time.' 
  },
  { 
    icon: AlertTriangle, 
    title: 'Waiting List Promotion', 
    desc: 'Exactly 12 confirmed squads play. Any additional squads enter Waiting List — if a team fails to show up on time, the waiting team plays in their place.' 
  },
  { 
    icon: Shield, 
    title: 'Anti-Hack & Fair Play', 
    desc: 'Screen recording and anti-cheat verification may be requested at any stage. Cheating will result in an immediate criminal blacklist.' 
  },
];

export default function EsportsRules() {
  return (
    <section id="rules" className="py-24 px-4 relative z-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white font-heading">
            Esports <span className="text-[#DC2626]">Rules & Guidelines</span>
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Official binding rules and conduct policy for all participants</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RULES.map((rule, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity:0, y:20 }} 
              whileInView={{ opacity:1, y:0 }} 
              viewport={{ once:true }} 
              transition={{ delay: i * 0.06 }}
              className="bg-[#0a0a0f] border border-white/5 hover:border-[#DC2626]/50 rounded-2xl p-6 flex items-start gap-4 group transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(220,38,38,0.15)] shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#DC2626]/20 transition-colors">
                <rule.icon className="w-6 h-6 text-[#DC2626]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-bold font-mono">0{i+1}.</span>
                  <h4 className="font-black text-white text-base tracking-wide">{rule.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{rule.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
