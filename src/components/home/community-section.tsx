'use client';
import { motion } from 'framer-motion';
import { MessageCircle, MessageSquare, PlaySquare, Users, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';

export default function CommunitySection() {
  const links = [
    { 
      icon: MessageCircle, 
      label: 'WhatsApp Community', 
      sub: 'Lobby IDs, match announcements & chat', 
      href: SOCIAL_LINKS.whatsapp, 
      color: 'text-[#25D366]', 
      bg: 'bg-[#25D366]/10', 
      border: 'border-[#25D366]/40', 
      cta: 'Join WhatsApp Group',
      badge: 'OFFICIAL MATCH LOBBY'
    },
    { 
      icon: PlaySquare, 
      label: 'YouTube Channel', 
      sub: 'Live matches, highlights & streams', 
      href: SOCIAL_LINKS.youtube, 
      color: 'text-red-500', 
      bg: 'bg-red-600/10', 
      border: 'border-red-600/40', 
      cta: 'Subscribe @educatedgamer3',
      badge: 'LIVE STREAMS'
    },
    { 
      icon: MessageSquare, 
      label: 'Discord Server', 
      sub: 'Community voice rooms & ticket support', 
      href: SOCIAL_LINKS.discord, 
      color: 'text-[#5865F2]', 
      bg: 'bg-[#5865F2]/10', 
      border: 'border-[#5865F2]/40', 
      cta: 'Join Discord',
      badge: '24/7 SUPPORT'
    },
    { 
      icon: Users, 
      label: 'Facebook Page', 
      sub: 'Official posts & photo updates', 
      href: SOCIAL_LINKS.facebook, 
      color: 'text-blue-500', 
      bg: 'bg-blue-600/10', 
      border: 'border-blue-600/40', 
      cta: 'Follow Page',
      badge: 'ANNOUNCEMENTS'
    },
  ];

  return (
    <section id="community" className="py-24 px-4 relative z-20 bg-black/40 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white font-heading">
            Join the <span className="text-[#DC2626]">Community</span>
          </h2>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Connect on WhatsApp, watch on YouTube, and sync with the squad</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#DC2626] to-transparent mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((item, i) => (
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }}>
              <Link href={item.href} target="_blank" className="block h-full">
                <div className={`bg-[#0a0a0f] border ${item.border} rounded-2xl p-6 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group flex flex-col justify-between h-full relative overflow-hidden`}>
                  <div className="space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 block w-fit mx-auto">
                      {item.badge}
                    </span>
                    <div className={`w-16 h-16 mx-auto ${item.bg} border ${item.border} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg mb-1">{item.label}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                  <div className="pt-6">
                    <span className={`block w-full py-2.5 rounded-xl border ${item.border} ${item.bg} ${item.color} text-xs font-black uppercase tracking-wider group-hover:brightness-125 transition-all`}>
                      {item.cta}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contribution & Sponsorship Banner */}
        <motion.div 
          initial={{ opacity:0, y:20 }} 
          whileInView={{ opacity:1, y:0 }} 
          viewport={{ once:true }}
          className="bg-gradient-to-r from-red-950/40 via-[#0a0a0f] to-red-950/40 border border-[#DC2626]/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-center justify-center flex-shrink-0 text-[#DC2626] mx-auto md:mx-0 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#DC2626] bg-[#DC2626]/10 px-2.5 py-0.5 rounded-full border border-[#DC2626]/20">
                Support & Sponsor Tournament
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-wide mt-1 font-heading">
                Want to Contribute to Prize Pool?
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Help us boost the reward for players and empower grassroots Free Fire esports in Pakistan.
              </p>
            </div>
          </div>

          <Link
            href={SOCIAL_LINKS.contributionWhatsapp}
            target="_blank"
            className="flex-shrink-0 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-black uppercase text-xs sm:text-sm tracking-widest px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(37,211,102,0.3)] transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Contribute on WhatsApp ({SOCIAL_LINKS.contributionNumber})
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
