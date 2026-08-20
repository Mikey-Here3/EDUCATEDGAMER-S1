'use client';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

export default function WinnersSection({ winners }: { winners: any[] }) {
  if (!winners || winners.length === 0) return null;

  const icons = [Trophy, Medal, Award];
  const colors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
  const bgs = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-500/10 border-gray-500/30', 'bg-amber-700/10 border-amber-700/30'];

  return (
    <section id="winners" className="py-24 px-4 relative z-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            Championship <span className="text-[#DC2626]">Winners</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {winners.slice(0,3).map((w: any, i: number) => {
            const Icon = icons[i] || Award;
            return (
              <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.15 }}
                className={`bg-[#0a0a0f] border rounded-2xl p-8 text-center ${bgs[i]}`}>
                <div className={`w-20 h-20 mx-auto rounded-full border-2 ${bgs[i]} flex items-center justify-center mb-4`}>
                  <Icon className={`w-10 h-10 ${colors[i]}`} />
                </div>
                <p className={`text-3xl font-black mb-1 ${colors[i]}`}>{w.position}</p>
                <h3 className="text-xl font-black text-white">{w.team_name}</h3>
                <p className="text-sm text-gray-400 mt-1">{w.prize}</p>
                {w.season && <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">Season {w.season}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
