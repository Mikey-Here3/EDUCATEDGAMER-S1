import { adminLoginAction } from '@/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, AlertTriangle, ArrowLeft, KeyRound } from 'lucide-react'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params?.error === 'true'

  const handleAdminLogin = async (formData: FormData) => {
    'use server'
    const res = await adminLoginAction(formData)
    if (!res.success) {
      redirect('/admin/login?error=true')
    }
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] p-4 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <ShieldCheck className="w-8 h-8 text-[#DC2626]" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tight text-white uppercase font-heading">
            Admin Authority Login
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Educated Gamer Management Portal
          </p>
        </div>

        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
          {hasError && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>Invalid admin email or password. Please verify your credentials.</span>
            </div>
          )}

          <form action={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Admin Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="admin@educatedgamer.com"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-black italic uppercase tracking-widest py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_35px_rgba(220,38,38,0.5)] cursor-pointer"
            >
              AUTHENTICATE ADMIN ›
            </button>
          </form>

          {/* Quick Credential Hint for the User */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-gray-400 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-[#DC2626]" /> Master Credentials:</p>
            <p><strong className="text-gray-300">Email:</strong> admin@educatedgamer.com</p>
            <p><strong className="text-gray-300">Password:</strong> EG@Admin2026!</p>
          </div>

          <div className="pt-2 border-t border-white/5 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
