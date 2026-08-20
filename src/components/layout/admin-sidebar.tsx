'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, Trophy, Crosshair, Home, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Standings & Kills', href: '/admin/standings', icon: Crosshair },
    { name: 'Winners', href: '/admin/winners', icon: Trophy },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-[#050507] border-r border-white/10 sm:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/admin" className="flex items-center gap-3 font-black text-white tracking-wider uppercase">
          <span className="w-8 h-8 bg-gradient-to-br from-[#DC2626] to-[#991b1b] rounded-lg flex items-center justify-center text-xs font-black text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]">EG</span>
          Admin Panel
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-3 gap-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all text-sm font-bold",
                  isActive 
                    ? "bg-[#DC2626]/20 text-[#DC2626] border border-[#DC2626]/30" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <Home className="w-4 h-4" /> View Website
        </Link>
        <Link href="/admin/login" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </Link>
      </div>
    </aside>
  )
}
