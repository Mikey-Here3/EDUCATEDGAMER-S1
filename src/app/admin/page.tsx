import { createAdminClient } from '@/lib/supabase/admin'
import { TOURNAMENT_ID } from '@/lib/constants'
import Link from 'next/link'
import { Users, CheckCircle, Clock, Trophy, Crosshair, Settings } from 'lucide-react'

export default async function AdminDashboardPage() {
  let totalTeams = 0, approvedTeams = 0, pendingTeams = 0;
  try {
    const supabase = createAdminClient();
    const [{ count: t }, { count: a }, { count: p }] = await Promise.all([
      supabase.from('teams').select('*', { count: 'exact', head: true }).eq('tournament_id', TOURNAMENT_ID),
      supabase.from('teams').select('*', { count: 'exact', head: true }).eq('tournament_id', TOURNAMENT_ID).eq('status', 'approved'),
      supabase.from('teams').select('*', { count: 'exact', head: true }).eq('tournament_id', TOURNAMENT_ID).eq('status', 'pending'),
    ]);
    totalTeams = t || 0; approvedTeams = a || 0; pendingTeams = p || 0;
  } catch {}

  const cards = [
    { label: 'Total Registered', value: totalTeams, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Approved', value: approvedTeams, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Pending Review', value: pendingTeams, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Slots Remaining', value: 12 - approvedTeams, icon: Trophy, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  const quickActions = [
    { label: 'Manage Teams', href: '/admin/teams', icon: Users, desc: 'Approve, reject, manage waiting list' },
    { label: 'Update Standings', href: '/admin/standings', icon: Crosshair, desc: 'Edit points table & MVP kills' },
    { label: 'Set Winners', href: '/admin/winners', icon: Trophy, desc: 'Announce championship winners' },
    { label: 'Tournament Settings', href: '/admin/settings', icon: Settings, desc: 'Toggle registration, update prizes' },
  ];

  return (
    <div className="p-6 space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Educated Gamer Tournament Control Panel</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className={`rounded-xl border p-5 ${card.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="bg-[#0a0a0f] border border-white/10 hover:border-[#DC2626]/40 rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg flex items-center justify-center group-hover:bg-[#DC2626]/20 transition-colors">
                <action.icon className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div>
                <div className="font-black text-white text-sm">{action.label}</div>
                <div className="text-xs text-gray-500">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
