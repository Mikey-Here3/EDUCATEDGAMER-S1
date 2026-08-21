import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { PageHeader } from '@/components/shared/page-header'
import { MessageCircle, MessageSquare, PlaySquare, Users, Send, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react'
import Link from 'next/link'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function ContactPage() {
  const channels = [
    {
      title: 'WhatsApp Community',
      handle: 'Official Match Lobbies & Chat',
      desc: 'Get instant notifications, custom room credentials, and match timings directly on WhatsApp.',
      link: SOCIAL_LINKS.whatsapp,
      icon: MessageCircle,
      badge: 'RECOMMENDED FOR SQUADS',
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10',
      border: 'border-[#25D366]/40',
      btn: 'Join WhatsApp Group',
    },
    {
      title: 'YouTube Channel',
      handle: '@educatedgamer3',
      desc: 'Watch live broadcasts, match highlights, MVP compilations, and stream draw announcements.',
      link: SOCIAL_LINKS.youtube,
      icon: PlaySquare,
      badge: 'LIVE TOURNAMENT STREAM',
      color: 'text-red-500',
      bg: 'bg-red-600/10',
      border: 'border-red-600/40',
      btn: 'Subscribe on YouTube',
    },
    {
      title: 'Discord Server',
      handle: 'discord.gg/bE2Cta8q',
      desc: 'Voice channels, referee support tickets, dispute arbitration, and team coordination.',
      link: SOCIAL_LINKS.discord,
      icon: MessageSquare,
      badge: 'VOICE & TICKET SUPPORT',
      color: 'text-[#5865F2]',
      bg: 'bg-[#5865F2]/10',
      border: 'border-[#5865F2]/40',
      btn: 'Join Discord Server',
    },
    {
      title: 'Facebook Page',
      handle: 'EducatedGamer3',
      desc: 'Official tournament fixtures, winner announcements, and community posts.',
      link: SOCIAL_LINKS.facebook,
      icon: Users,
      badge: 'OFFICIAL ANNOUNCEMENTS',
      color: 'text-blue-500',
      bg: 'bg-blue-600/10',
      border: 'border-blue-600/40',
      btn: 'Follow on Facebook',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-32 pb-24">
        <PageHeader 
          title="CONTACT & COMMUNITY HEADQUARTERS" 
          subtitle="Connect with Educated Gamer management for registrations, inquiries, or match support." 
        />
        
        {/* Social Platforms Grid */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((ch, idx) => (
            <Link key={idx} href={ch.link} target="_blank" className="block group">
              <div className={`bg-[#0a0a0f] border ${ch.border} rounded-2xl p-6 sm:p-8 hover:-translate-y-1.5 transition-all duration-300 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${ch.bg} ${ch.border} ${ch.color}`}>
                      {ch.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${ch.bg} border ${ch.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <ch.icon className={`w-7 h-7 ${ch.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">{ch.title}</h3>
                      <p className={`text-xs font-bold ${ch.color}`}>{ch.handle}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {ch.desc}
                  </p>
                </div>

                <div className="pt-6">
                  <span className={`block w-full text-center py-3 rounded-xl border ${ch.border} ${ch.bg} ${ch.color} text-xs font-black uppercase tracking-widest group-hover:brightness-125 transition-all`}>
                    {ch.btn} ›
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Direct Inquiries & Rules Reminder Box */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Box: Support Info */}
          <div className="lg:col-span-6 bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black italic tracking-wide uppercase text-white font-heading flex items-center gap-2 border-l-4 border-[#DC2626] pl-3">
              Direct Support & Inquiries
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <Mail className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider text-xs">Official Management Email</p>
                  <p className="text-gray-400 mt-0.5">ASHANMIROFFICIAL@GMAIL.COM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <Clock className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider text-xs">Support Hours</p>
                  <p className="text-gray-400 mt-0.5">24/7 Match day support via WhatsApp & Discord</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <MapPin className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase tracking-wider text-xs">Coverage Region</p>
                  <p className="text-gray-400 mt-0.5">Pakistan / South Asia Mobile Esports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box: Key Policy Reminder */}
          <div className="lg:col-span-6 bg-[#DC2626]/5 border border-[#DC2626]/30 rounded-2xl p-8 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#DC2626]" />
                <h3 className="text-xl font-black italic tracking-wide uppercase text-white font-heading">
                  Important Policy Notices
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 leading-relaxed list-disc ml-5">
                <li><strong className="text-white">Strict Non-Refundable Fee:</strong> The 100 PKR entry fee is non-refundable once your team registration is processed.</li>
                <li><strong className="text-white">Final Authority:</strong> Management arbitration and decision on all standings, kills, and disputes is final.</li>
                <li><strong className="text-white">Conduct Policy:</strong> Any abusive or toxic behavior leads to instant disqualification of the entire squad.</li>
              </ul>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                href={SOCIAL_LINKS.whatsapp} 
                target="_blank"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-black uppercase text-xs tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all text-center"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Lobbies
              </Link>
              <Link 
                href={SOCIAL_LINKS.contributionWhatsapp} 
                target="_blank"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black uppercase text-xs tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all text-center"
              >
                Contribute / Sponsor ({SOCIAL_LINKS.contributionNumber})
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
