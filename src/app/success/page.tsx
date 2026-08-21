import Link from 'next/link'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { sql } from '@/lib/db'
import { Crown, Users, CheckCircle2, Clock, Copy } from 'lucide-react'

export const revalidate = 0

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const resolvedParams = await searchParams
  const teamCode = resolvedParams?.code

  if (!teamCode) {
    redirect('/register')
  }

  let team: any = null
  let players: any[] = []

  try {
    const teamRows = await sql`SELECT * FROM teams WHERE team_code = ${teamCode} LIMIT 1;`
    if (teamRows.length > 0) {
      team = teamRows[0]
      const playerRows = await sql`SELECT * FROM players WHERE team_id = ${team.id} ORDER BY created_at ASC;`
      players = playerRows || []
    }
  } catch (err) {
    console.error('Neon success page error:', err)
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050507] text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-red-500/30 rounded-2xl p-10 text-center max-w-md space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">⚠️</div>
            <h1 className="text-2xl font-black text-red-400 uppercase tracking-wider font-heading">Team Not Found</h1>
            <p className="text-gray-400 text-sm">
              We could not find a team with code <strong className="text-white font-mono">{teamCode}</strong>. 
              This may be due to a data sync delay. Please try again in a moment.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="/register" className="flex-1 text-center bg-[#DC2626] hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl transition-all">
                Register Again
              </Link>
              <Link href="/" className="flex-1 text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl transition-all">
                Go Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/10 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
  }
  const statusColor = statusColors[team.status] || statusColors.pending
  const teamInitials = team.team_name?.slice(0, 2).toUpperCase() || 'EG'

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Success Header */}
          <div className="text-center space-y-3">
            <div className="text-6xl">🎉</div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase font-heading">
              <span className="text-white">Registration </span>
              <span className="text-[#DC2626]">Complete!</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Your team has been registered. Keep your Team Code safe — it's how we identify your squad!
            </p>
          </div>

          {/* Team Code Card */}
          <div className="bg-[#0a0a0f] border border-[#DC2626]/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(220,38,38,0.1)] text-center space-y-2">
            <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Your Team Code</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-black font-mono text-white tracking-widest">{team.team_code}</span>
            </div>
            <p className="text-[11px] text-gray-500">Screenshot this and share with your squad</p>
          </div>

          {/* Team Details Card */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Team header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600/30 to-black border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {team.logo_url ? (
                  <img src={team.logo_url} alt="Team Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-white text-base font-mono">{teamInitials}</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-white uppercase font-heading">{team.team_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                    {team.status === 'pending' ? '⏳ Pending Approval' : team.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Squad Roster */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#DC2626]" /> Squad Roster ({players.length + 1} players)
              </h3>

              {/* Captain */}
              <div className="flex items-center justify-between bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-white text-sm font-bold">{team.leader_name}</span>
                  <span className="text-[10px] text-yellow-400 font-black uppercase tracking-wider bg-yellow-500/10 px-2 py-0.5 rounded-full">Captain</span>
                </div>
                <span className="text-gray-400 font-mono text-xs">{team.leader_uid}</span>
              </div>

              {/* Members */}
              {players.filter((p: any) => p.player_type !== 'leader').map((player: any, idx: number) => (
                <div key={player.id} className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${player.player_type === 'substitute' ? 'bg-gray-700/50 text-gray-400' : 'bg-red-500/10 text-red-400'}`}>
                      {player.player_type === 'substitute' ? 'Sub' : `P${idx + 2}`}
                    </span>
                    <span className="text-white text-sm">{player.player_name}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-xs">{player.free_fire_uid}</span>
                </div>
              ))}
            </div>

            {/* Status note */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-300">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p>Your team is <strong>pending review</strong>. The management will approve your team after verifying the payment proof. You'll receive a WhatsApp notification.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="https://chat.whatsapp.com/IS43tYX1KOE6Xe4AgJ2dwt"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all"
            >
              Join WhatsApp Community
            </Link>
            <Link
              href="https://discord.gg/bE2Cta8q"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(88,101,242,0.3)] transition-all"
            >
              Join Discord Server
            </Link>
            <Link
              href="/teams"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl transition-all col-span-full"
            >
              View All Registered Teams →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
