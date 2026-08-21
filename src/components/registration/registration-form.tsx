'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, Users, Plus, Trash2, DollarSign, Upload, ShieldAlert, Image as ImageIcon, Sparkles } from 'lucide-react'
import { registerTeam } from '@/actions/register'
import { PAYMENT_METHODS } from '@/lib/constants'

interface PlayerRow {
  name: string
  nickname: string
  uid: string
}

export function RegistrationForm({ tournamentId, registeredCount, maxTeams }: { tournamentId?: string, registeredCount?: number, maxTeams?: number }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Team & Captain Info
  const [teamName, setTeamName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [captainName, setCaptainName] = useState('')
  const [captainNickname, setCaptainNickname] = useState('')
  const [captainUid, setCaptainUid] = useState('')
  const [captainEmail, setCaptainEmail] = useState('')
  const [captainWhatsapp, setCaptainWhatsapp] = useState('')

  // Autofill from Google OAuth redirect
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { getGoogleAuthUrl } = await import('@/actions/auth')
      const res = await getGoogleAuthUrl('/register')
      if (res.success && res.url) {
        window.location.href = res.url
      } else {
        setError(res.error || 'Failed to initialize Google Authentication.')
        setIsGoogleLoading(false)
      }
    } catch (err: any) {
      setError('Auth initialization error. Please try again.')
      setIsGoogleLoading(false)
    }
  }

  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get('email')
      const nameParam = params.get('name')
      if (emailParam) setCaptainEmail(emailParam)
      if (nameParam) setCaptainName(nameParam)
    }
  })

  // Roster (Initial 3 members + Captain = 4 minimum; up to 6 members = 7 total)
  const [roster, setRoster] = useState<PlayerRow[]>([
    { name: '', nickname: '', uid: '' },
    { name: '', nickname: '', uid: '' },
    { name: '', nickname: '', uid: '' },
  ])

  // Screenshots
  const [uidScreenshot, setUidScreenshot] = useState<string | null>(null)
  const [paymentProof, setPaymentProof] = useState<string | null>(null)

  // Rules Agreement
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleAddPlayer = () => {
    if (roster.length < 6) { // 1 Captain + 6 Members/Subs = 7 TOTAL max!
      setRoster([...roster, { name: '', nickname: '', uid: '' }])
    }
  }

  const handleRemovePlayer = (index: number) => {
    if (roster.length > 3) { // keep minimum 3 members (4 total with Captain)
      setRoster(roster.filter((_, i) => i !== index))
    }
  }

  const handlePlayerChange = (index: number, field: keyof PlayerRow, value: string) => {
    const updated = [...roster]
    updated[index][field] = value
    setRoster(updated)
  }

  // Upload Loading States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingUid, setIsUploadingUid] = useState(false)
  const [isUploadingProof, setIsUploadingProof] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'uid' | 'proof') => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    if (type === 'logo') setIsUploadingLogo(true)
    if (type === 'uid') setIsUploadingUid(true)
    if (type === 'proof') setIsUploadingProof(true)

    try {
      const { uploadImageToCloudinary } = await import('@/actions/upload')
      const res = await uploadImageToCloudinary(formData)
      if (res.success && res.url) {
        if (type === 'logo') setLogoUrl(res.url)
        if (type === 'uid') setUidScreenshot(res.url)
        if (type === 'proof') setPaymentProof(res.url)
      } else {
        setError(res.error || 'Failed to upload image to Cloudinary.')
      }
    } catch (err: any) {
      setError('Upload failed. Please check network connection.')
    } finally {
      if (type === 'logo') setIsUploadingLogo(false)
      if (type === 'uid') setIsUploadingUid(false)
      if (type === 'proof') setIsUploadingProof(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreed) {
      setError('You must accept the tournament rules, non-refundable policy, and zero-tolerance conduct policy.')
      return
    }

    if (!teamName || !captainName || !captainUid || !captainWhatsapp) {
      setError('Please fill in all required Team Captain fields.')
      return
    }

    // UID Numbers Only Validation
    const isNumeric = (str: string) => /^\d+$/.test(str.trim())
    
    if (!isNumeric(captainUid)) {
      setError('Captain Free Fire UID must contain numbers only.')
      return
    }

    for (let i = 0; i < 3; i++) {
      if (!roster[i].name || !roster[i].uid) {
        setError(`Please fill in Squad Member #${i + 2} name and UID. Minimum 4 players required.`)
        return
      }
      if (!isNumeric(roster[i].uid)) {
        setError(`Squad Member #${i + 2} Free Fire UID must contain numbers only.`)
        return
      }
    }

    // Substitute UID check
    for (let i = 3; i < roster.length; i++) {
      if (roster[i].name && roster[i].uid && !isNumeric(roster[i].uid)) {
        setError(`Substitute Player Free Fire UID must contain numbers only.`)
        return
      }
    }

    // MANDATORY SCREENSHOT VERIFICATION
    if (!uidScreenshot) {
      setError('Captain Profile Screenshot is required. Please upload your in-game profile proof.')
      return
    }

    if (!paymentProof) {
      setError('JazzCash Transaction Proof is required. Please send 100 PKR and upload the receipt screenshot.')
      return
    }

    startTransition(async () => {
      const payload: any = {
        teamName,
        logoUrl,
        leaderName: captainNickname ? `${captainName} (${captainNickname})` : captainName,
        leaderUid: captainUid,
        whatsapp: captainWhatsapp,
        discord: captainEmail,
        uidScreenshot,
        paymentProof,
        player2Name: roster[0].nickname ? `${roster[0].name} (${roster[0].nickname})` : roster[0].name,
        player2Uid: roster[0].uid,
        player3Name: roster[1].nickname ? `${roster[1].name} (${roster[1].nickname})` : roster[1].name,
        player3Uid: roster[1].uid,
        player4Name: roster[2].nickname ? `${roster[2].name} (${roster[2].nickname})` : roster[2].name,
        player4Uid: roster[2].uid,
      }

      if (roster[3] && roster[3].name && roster[3].uid) {
        payload.substituteName = roster[3].nickname ? `${roster[3].name} (${roster[3].nickname})` : roster[3].name
        payload.substituteUid = roster[3].uid
      }
      if (roster[4] && roster[4].name && roster[4].uid) {
        payload.substitute2Name = roster[4].nickname ? `${roster[4].name} (${roster[4].nickname})` : roster[4].name
        payload.substitute2Uid = roster[4].uid
      }
      if (roster[5] && roster[5].name && roster[5].uid) {
        payload.substitute3Name = roster[5].nickname ? `${roster[5].name} (${roster[5].nickname})` : roster[5].name
        payload.substitute3Uid = roster[5].uid
      }

      const result = await registerTeam(payload)
      if (result.success && result.team_code) {
        router.push(`/success?code=${result.team_code}`)
      } else {
        setError(result.error || 'Failed to submit registration. Please check your inputs.')
      }
    })
  }

  const totalPlayersCount = 1 + roster.length
  const teamInitials = teamName ? teamName.slice(0, 2).toUpperCase() : 'EG'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Banner: Faster with Google */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-center justify-center text-[#DC2626] flex-shrink-0">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-white text-base">Register faster with Google</h4>
            <p className="text-gray-400 text-xs mt-0.5">Log in to auto-fill captain email details and sync match notifications.</p>
          </div>
        </div>
        <button 
          type="button"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isGoogleLoading ? 'Connecting...' : 'Sign In with Google'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. TEAM & CAPTAIN INFO */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#DC2626]" />
            <h3 className="font-black italic uppercase tracking-wider text-lg sm:text-xl text-white font-heading">
              Team & Captain Info
            </h3>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full">
            Guild or Custom Team
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Team Name */}
            <div className="sm:col-span-8">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Team / Guild Name *</label>
              <input 
                required
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. Thunder Strikers or TG Gaming"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Team Logo Upload / URL */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-gray-500" /> Logo (Optional)</span>
                {isUploadingLogo && <span className="text-[10px] text-yellow-400 font-mono animate-pulse">Uploading...</span>}
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/30 to-black border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" onError={() => setLogoUrl('')} />
                  ) : (
                    <span className="font-black text-white text-xs font-mono">{teamInitials}</span>
                  )}
                </div>
                <label className="flex-1 flex items-center justify-center gap-2 bg-black/60 hover:bg-white/5 border border-white/10 hover:border-[#DC2626] rounded-xl px-3 py-3 text-white text-xs cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400 truncate">{logoUrl ? 'Change Logo' : 'Upload File'}</span>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Captain Name *</label>
              <input 
                required
                value={captainName}
                onChange={e => setCaptainName(e.target.value)}
                placeholder="Captain full name"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Captain Nickname / IGN</label>
              <input 
                value={captainNickname}
                onChange={e => setCaptainNickname(e.target.value)}
                placeholder="In-game Name (IGN)"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Captain Free Fire UID *</label>
              <input 
                required
                value={captainUid}
                onChange={e => setCaptainUid(e.target.value)}
                placeholder="e.g. 1234567890"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Captain Email (Notifications)</label>
              <input 
                type="email"
                value={captainEmail}
                onChange={e => setCaptainEmail(e.target.value)}
                placeholder="captain@gmail.com"
                className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Captain WhatsApp Number (For Room ID) *</label>
            <input 
              required
              value={captainWhatsapp}
              onChange={e => setCaptainWhatsapp(e.target.value)}
              placeholder="03XXXXXXXXX (with country code)"
              className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. SQUAD ROSTER (UP TO 7 PLAYERS TOTAL) */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#DC2626]" />
            <h3 className="font-black italic uppercase tracking-wider text-lg sm:text-xl text-white font-heading">
              Squad Roster (Up to 7 Players)
            </h3>
          </div>
          {roster.length < 6 && (
            <button 
              type="button" 
              onClick={handleAddPlayer}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/40 hover:bg-[#DC2626]/20 text-xs font-bold text-[#DC2626] hover:text-white transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + Add Substitute ({totalPlayersCount}/7)
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Core 4 players are required (Captain + 3 Squad Members). You can register up to <strong className="text-white">3 extra substitute players (7 members total)</strong> from any guild.
        </p>

        <div className="space-y-4">
          {roster.map((player, idx) => (
            <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-4 sm:p-5 space-y-3 relative group">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                <span className={idx < 3 ? 'text-white' : 'text-yellow-500'}>
                  {idx < 3 ? `Squad Member #${idx + 2}` : `Substitute Player #${idx + 2}`}
                </span>
                {idx >= 3 && (
                  <button 
                    type="button"
                    onClick={() => handleRemovePlayer(idx)}
                    className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Player Name {idx < 3 && '*'}</label>
                  <input 
                    required={idx < 3}
                    value={player.name}
                    onChange={e => handlePlayerChange(idx, 'name', e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-lg px-3 py-2 text-white text-xs focus:outline-none placeholder:text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nickname / IGN</label>
                  <input 
                    value={player.nickname}
                    onChange={e => handlePlayerChange(idx, 'nickname', e.target.value)}
                    placeholder="In-game IGN"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-lg px-3 py-2 text-white text-xs focus:outline-none placeholder:text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Free Fire UID {idx < 3 && '*'}</label>
                  <input 
                    required={idx < 3}
                    value={player.uid}
                    onChange={e => handlePlayerChange(idx, 'uid', e.target.value)}
                    placeholder="Free Fire UID"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#DC2626] rounded-lg px-3 py-2 text-white text-xs focus:outline-none placeholder:text-gray-700 font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PAYMENT INSTRUCTIONS */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <DollarSign className="w-5 h-5 text-[#DC2626]" />
          <h3 className="font-black italic uppercase tracking-wider text-lg sm:text-xl text-white font-heading">
            Payment Instructions
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            The entry fee for this tournament is <strong className="text-white font-black">{PAYMENT_METHODS.fee}</strong> for the entire squad (including substitutes). Send the payment via <strong className="text-yellow-400">JazzCash</strong> only:
          </p>

          <div className="bg-black/60 border border-yellow-500/30 rounded-xl p-5 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider block">Official JazzCash Account</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{PAYMENT_METHODS.jazzcash.account}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Account Title</span>
                <span className="text-sm font-bold text-yellow-400">{PAYMENT_METHODS.jazzcash.name}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 border-t border-white/5 pt-2">
              Note: After sending 100 PKR, attach the payment screenshot below to confirm your team registration.
            </p>
          </div>
        </div>
      </div>

      {/* 4. SCREENSHOT VERIFICATIONS */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Upload className="w-5 h-5 text-[#DC2626]" />
          <h3 className="font-black italic uppercase tracking-wider text-lg sm:text-xl text-white font-heading">
            Screenshot Verifications
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>Captain Profile Screenshot (Optional)</span>
              {isUploadingUid && <span className="text-[10px] text-yellow-400 font-mono animate-pulse">Uploading to Cloudinary...</span>}
            </label>
            <label className="border-2 border-dashed border-white/10 hover:border-[#DC2626]/50 bg-black/40 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'uid')} className="hidden" />
              {uidScreenshot ? (
                <div className="space-y-2">
                  <img src={uidScreenshot} alt="Profile" className="w-16 h-16 object-cover rounded-xl mx-auto border border-green-500/50" />
                  <span className="text-[11px] text-green-400 font-bold block">✓ Profile Screenshot Uploaded</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-400 font-bold">
                    Attach captain in-game profile screenshot
                  </span>
                </>
              )}
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>Entry Fee Proof (Optional)</span>
              {isUploadingProof && <span className="text-[10px] text-yellow-400 font-mono animate-pulse">Uploading to Cloudinary...</span>}
            </label>
            <label className="border-2 border-dashed border-white/10 hover:border-[#DC2626]/50 bg-black/40 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'proof')} className="hidden" />
              {paymentProof ? (
                <div className="space-y-2">
                  <img src={paymentProof} alt="Proof" className="w-16 h-16 object-cover rounded-xl mx-auto border border-green-500/50" />
                  <span className="text-[11px] text-green-400 font-bold block">✓ Payment Receipt Uploaded</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-400 font-bold">
                    Attach transaction screenshot / receipt
                  </span>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* 5. MANDATORY RULES & CONDUCT AGREEMENT */}
      <div className="bg-[#DC2626]/5 border border-[#DC2626]/30 rounded-2xl p-6 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-700 text-[#DC2626] focus:ring-[#DC2626] accent-[#DC2626] cursor-pointer"
          />
          <div className="text-xs text-gray-300 leading-relaxed font-medium">
            I confirm and agree to all tournament terms:
            <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-400">
              <li><strong className="text-white">Strict Non-Refundable Fee:</strong> The 100 PKR entry fee is non-refundable under any circumstances.</li>
              <li><strong className="text-white">Management Decision is Final:</strong> Management holds absolute authority over points, standings, and lobby rulings.</li>
              <li><strong className="text-white">Zero Tolerance Conduct:</strong> Any kind of misbehavior, abusive language, toxicity, or cheating will result in <strong className="text-red-400">IMMEDIATE team removal and permanent ban</strong>.</li>
            </ul>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-[#DC2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#DC2626] text-white font-black italic text-lg sm:text-xl py-5 rounded-2xl uppercase tracking-widest shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
      >
        {isPending ? 'PROCESSING REGISTRATION...' : 'Confirm Team Roster Registration ›'}
      </button>
    </form>
  )
}
