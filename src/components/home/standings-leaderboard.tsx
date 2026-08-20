'use client';
import { motion } from 'framer-motion';
import { Trophy, Crosshair } from 'lucide-react';

export default function StandingsLeaderboard({ standings, kills }: { standings: any[], kills: any[] }) {
  return (
    <section id="standings" className="py-24 px-4 bg-black/30 relative z-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            Standings <span className="text-[#DC2626]">Leaderboard</span>
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Live tournament rankings — updated after each match</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Points Table */}
          <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-white/10">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="font-black uppercase tracking-wider text-white text-sm">Team Points Table</h3>
            </div>
            {standings.length === 0 ? (
              <div className="p-10 text-center">
                <Trophy className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">No standings yet</p>
                <p className="text-gray-600 text-xs mt-1">Table updates once tournament matches begin</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-3 text-gray-500 uppercase tracking-wider font-bold w-8">#</th>
                      <th className="text-left p-3 text-gray-500 uppercase tracking-wider font-bold">Team</th>
                      <th className="text-center p-3 text-gray-500 uppercase tracking-wider font-bold">Kills</th>
                      <th className="text-center p-3 text-gray-500 uppercase tracking-wider font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row: any, i: number) => (
                      <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i===0?'bg-yellow-500/5':i===1?'bg-gray-500/5':i===2?'bg-amber-700/5':''}`}>
                        <td className="p-3 font-black text-center">
                          <span className={`${i===0?'text-yellow-400':i===1?'text-gray-300':i===2?'text-amber-600':'text-gray-500'}`}>{i+1}</span>
                        </td>
                        <td className="p-3 font-bold text-white">{row.team_name}</td>
                        <td className="p-3 text-center text-gray-300 font-mono">{row.kills}</td>
                        <td className="p-3 text-center font-black text-[#DC2626] font-mono">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Most Kills */}
          <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-white/10">
              <Crosshair className="w-5 h-5 text-[#DC2626]" />
              <h3 className="font-black uppercase tracking-wider text-white text-sm">Most Kills (MVP)</h3>
            </div>
            {kills.length === 0 ? (
              <div className="p-10 text-center">
                <Crosshair className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">No kill data yet</p>
                <p className="text-gray-600 text-xs mt-1">MVP board updates after each match</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-3 text-gray-500 uppercase tracking-wider font-bold w-8">#</th>
                      <th className="text-left p-3 text-gray-500 uppercase tracking-wider font-bold">Player</th>
                      <th className="text-left p-3 text-gray-500 uppercase tracking-wider font-bold">Team</th>
                      <th className="text-center p-3 text-gray-500 uppercase tracking-wider font-bold">Kills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kills.map((row: any, i: number) => (
                      <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i===0?'bg-red-500/5':''}`}>
                        <td className="p-3 font-black text-center"><span className={i===0?'text-[#DC2626]':'text-gray-500'}>{i+1}</span></td>
                        <td className="p-3 font-bold text-white">{row.player_name}</td>
                        <td className="p-3 text-gray-400">{row.team_name}</td>
                        <td className="p-3 text-center font-black text-[#DC2626] font-mono">{row.kills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
