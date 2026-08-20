'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogIn, AlertTriangle, ShieldCheck, Clock, Eye, EyeOff } from 'lucide-react'
import { getGoogleAuthUrl, signInWithEmailAction } from '@/actions/auth'

const MAX_FAILED_ATTEMPTS = 4
const LOCKOUT_SECONDS = 30

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Rate Limiting State
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)

  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      setErrorMessage('Authentication failed. Please check your credentials or try again.')
    }
  }, [searchParams])

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            setFailedAttempts(0) // reset attempts after cooldown
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [lockoutRemaining])

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    startTransition(async () => {
      const res = await getGoogleAuthUrl('/register')
      if (res.success && res.url) {
        window.location.href = res.url
      } else {
        setErrorMessage(res.error || 'Failed to initialize Google login.')
      }
    })
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (lockoutRemaining > 0) {
      setErrorMessage(`Too many failed attempts. Please wait ${lockoutRemaining} seconds.`)
      return
    }

    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.')
      return
    }

    startTransition(async () => {
      const res = await signInWithEmailAction({ email, password })

      if (res.success) {
        setSuccessMessage('Successfully authenticated! Redirecting...')
        setFailedAttempts(0)
        setTimeout(() => {
          router.push('/register')
        }, 1000)
      } else {
        const nextAttempts = failedAttempts + 1
        setFailedAttempts(nextAttempts)
        
        if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
          setLockoutRemaining(LOCKOUT_SECONDS)
          setErrorMessage(`Too many incorrect login attempts. Rate limiter activated! Locked for ${LOCKOUT_SECONDS}s.`)
        } else {
          setErrorMessage(`${res.error || 'Invalid email or password.'} (${MAX_FAILED_ATTEMPTS - nextAttempts} attempts remaining)`)
        }
      }
    })
  }

  const isLocked = lockoutRemaining > 0

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(220,38,38,0.2)]">
          <LogIn className="w-8 h-8 text-[#DC2626]" />
        </div>
        <h1 className="text-3xl font-black italic tracking-tight text-white uppercase font-heading">
          Player Sign In
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Log in to manage your squad, sync match lobbies & notifications
        </p>
      </div>

      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Rate limit lockout warning */}
        {isLocked && (
          <div className="bg-red-500/15 border border-red-500/50 p-4 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3 animate-pulse">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-black uppercase tracking-wider">Rate Limiter Active</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Please wait {lockoutRemaining} seconds before trying again.</p>
            </div>
          </div>
        )}

        {errorMessage && !isLocked && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-green-400 text-xs font-bold flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Google One-Click Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isPending || isLocked}
          className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-bold text-white text-sm shadow-md cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">or sign in with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email"
              required
              disabled={isLocked || isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@gmail.com"
              className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked || isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600 disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isPending || isLocked}
            className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-black italic uppercase tracking-widest py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_35px_rgba(220,38,38,0.5)] cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'AUTHENTICATING...' : isLocked ? `LOCKED (${lockoutRemaining}s)` : 'SIGN IN TO ACCOUNT'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="space-y-3 pt-2 text-center text-xs border-t border-white/5">
          <p className="text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#DC2626] font-bold hover:underline">
              Create Player Account →
            </Link>
          </p>
          <p className="text-gray-600 text-[11px]">
            Tournament Organizer?{' '}
            <Link href="/admin/login" className="text-gray-400 hover:text-white font-medium hover:underline">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
