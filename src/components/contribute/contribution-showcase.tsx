'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, DollarSign, Upload, ShieldAlert, CheckCircle2, User, UserX, Copy, Check, Sparkles, Building2, Smartphone, Wallet } from 'lucide-react'
import { submitContribution } from '@/actions/contribute'
import { PAYMENT_METHODS } from '@/lib/constants'
import { ensureAbsoluteUrl } from '@/lib/utils'

interface ContributionShowcaseProps {
  initialContributions: any[]
  totalRaised: number
}

export default function ContributionShowcase({
  initialContributions,
  totalRaised,
}: ContributionShowcaseProps) {
  const [contributions, setContributions] = useState(initialContributions)
  const [raisedSum, setRaisedSum] = useState(totalRaised)

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form fields
  const [contributorName, setContributorName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [amount, setAmount] = useState<number | ''>(500)
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank'>('JazzCash')
  const [proofUrl, setProofUrl] = useState('')
  const [message, setMessage] = useState('')

  // Upload states
  const [isUploading, setIsUploading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const quickAmounts = [100, 250, 500, 1000, 2500, 5000]

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_METHODS.jazzcash.account)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB limit
    if (file.size > MAX_SIZE) {
      setError('File size exceeds the 5MB limit. Please upload a smaller receipt image.')
      return
    }

    setIsUploading(true)
    setError('')
    try {
      const { compressImage } = await import('@/lib/image-compressor')
      const compressedFile = await compressImage(file)

      const formData = new FormData()
      formData.append('file', compressedFile)

      const { uploadImageToCloudinary } = await import('@/actions/upload')
      const res = await uploadImageToCloudinary(formData)
      if (res.success && res.url) {
        setProofUrl(res.url)
      } else {
        setError(res.error || 'Failed to upload receipt screenshot.')
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Please check network connection.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!amount || amount < 10) {
      setError('Please select or enter a valid contribution amount (minimum 10 PKR).')
      return
    }

    if (!isAnonymous && !contributorName.trim()) {
      setError('Please enter your name or check "Contribute as Anonymous".')
      return
    }

    if (paymentMethod !== 'JazzCash') {
      setError(`${paymentMethod} is coming soon! Please use JazzCash for now.`)
      return
    }

    startTransition(async () => {
      const res = await submitContribution({
        contributorName: contributorName.trim(),
        isAnonymous,
        amount: Number(amount),
        paymentMethod,
        proofUrl,
        message: message.trim(),
      })

      if (res.success) {
        const newRecord = {
          id: res.id,
          contributor_name: isAnonymous ? 'Anonymous Supporter' : (contributorName.trim() || 'Anonymous Supporter'),
          is_anonymous: isAnonymous,
          amount: Number(amount),
          payment_method: paymentMethod,
          message: message.trim(),
          created_at: new Date().toISOString(),
        }
        setContributions([newRecord, ...contributions])
        setRaisedSum(prev => prev + Number(amount))
        setSuccessMsg(`Thank you! Your contribution of ${amount} PKR has been added to the Community Honor Roll! 🎉`)

        // Reset form
        setContributorName('')
        setIsAnonymous(false)
        setProofUrl('')
        setMessage('')
      } else {
        setError(res.error || 'Failed to process contribution. Please try again.')
      }
    })
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl space-y-16">
      {/* HERO SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-red-400">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Support Educated Gamer Championship
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight font-heading">
          <span className="text-white">COMMUNITY </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">CONTRIBUTION</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Help us expand the prize pool and empower Pakistani Free Fire gamers. 100% of community contributions go directly towards winner payouts & MVP rewards!
        </p>

        {/* TOTAL RAISED BANNER */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl mt-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Total Community Fund</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 font-mono">
              {raisedSum.toLocaleString()} PKR
            </span>
          </div>
          <div className="h-px sm:h-12 w-full sm:w-px bg-white/10" />
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Total Supporters</span>
            <span className="text-3xl font-black text-white font-mono">{contributions.length} Contributors</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN GRID: FORM LEFT, HONOR ROLL RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONTRIBUTION FORM */}
        <div className="lg:col-span-7 bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-black text-white uppercase font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" /> Make a Contribution
            </h2>
            <p className="text-gray-400 text-xs mt-1">Select your preferred amount and payment method below.</p>
          </div>

          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 text-sm font-bold shadow-lg">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. PAYMENT METHOD SELECTION */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                1. Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* JazzCash (Active) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'JazzCash'
                      ? 'bg-red-500/15 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-xs">JazzCash</span>
                  <span className="text-[9px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded">
                    ACTIVE NOW
                  </span>
                </button>

                {/* EasyPaisa (Coming Soon) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('EasyPaisa')}
                  className="p-3.5 rounded-2xl border border-white/5 bg-black/30 opacity-60 text-gray-400 flex flex-col items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-xs">EasyPaisa</span>
                  <span className="text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded">
                    SOON
                  </span>
                </button>

                {/* Bank Transfer (Coming Soon) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank')}
                  className="p-3.5 rounded-2xl border border-white/5 bg-black/30 opacity-60 text-gray-400 flex flex-col items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-xs">Bank Transfer</span>
                  <span className="text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded">
                    SOON
                  </span>
                </button>
              </div>
            </div>

            {/* JAZZCASH DETAILS BOX */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-red-400 uppercase tracking-widest">JazzCash Account Info</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30">Official</span>
              </div>
              <div className="flex items-center justify-between bg-black/60 border border-white/10 p-3 rounded-xl">
                <div>
                  <div className="text-white font-black text-lg font-mono tracking-wider">{PAYMENT_METHODS.jazzcash.account}</div>
                  <div className="text-gray-400 text-xs">Account Title: <strong>{PAYMENT_METHODS.jazzcash.name}</strong></div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 2. AMOUNT SELECTION */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                2. Contribution Amount (PKR)
              </label>

              {/* Quick Pick Chips */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 px-3 rounded-xl border text-xs font-black font-mono transition-all cursor-pointer ${
                      amount === val
                        ? 'bg-red-600 border-red-500 text-white shadow-md'
                        : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {val} PKR
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <input
                type="number"
                min={10}
                value={amount}
                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Or enter custom amount in PKR..."
                className="w-full bg-black/60 border border-white/10 focus:border-red-500 text-white rounded-xl px-4 py-3 text-sm outline-none font-mono"
              />
            </div>

            {/* 3. CONTRIBUTOR NAME & ANONYMOUS TOGGLE */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  3. Contributor Identity
                </label>

                {/* Anonymous Checkbox */}
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    {isAnonymous ? <UserX className="w-3.5 h-3.5 text-amber-400" /> : <User className="w-3.5 h-3.5" />}
                    Contribute as Anonymous
                  </span>
                </label>
              </div>

              {!isAnonymous ? (
                <input
                  type="text"
                  value={contributorName}
                  onChange={e => setContributorName(e.target.value)}
                  placeholder="Your Name / Gamer Tag / Sponsor Name..."
                  className="w-full bg-black/60 border border-white/10 focus:border-red-500 text-white rounded-xl px-4 py-3 text-sm outline-none"
                />
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-300 text-xs font-bold flex items-center gap-2">
                  <UserX className="w-4 h-4 flex-shrink-0" />
                  <span>Your name will be hidden on the public Honor Roll as "Anonymous Supporter".</span>
                </div>
              )}
            </div>

            {/* 4. PAYMENT RECEIPT SCREENSHOT (OPTIONAL / 5MB) */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                4. Payment Receipt Screenshot (Optional, Max 5MB)
              </label>

              <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-red-500/50 transition-colors bg-black/40 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <Upload className="w-6 h-6 text-red-500 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    {isUploading ? 'Uploading Receipt...' : proofUrl ? '✅ Receipt Screenshot Uploaded!' : 'Click to Upload Payment Receipt Screenshot'}
                  </p>
                  <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* 5. MESSAGE / NOTE OF ENCOURAGEMENT */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                5. Encouragement Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write a shoutout or encouraging words for the Free Fire teams..."
                rows={3}
                className="w-full bg-black/60 border border-white/10 focus:border-red-500 text-white rounded-xl p-3 text-sm outline-none resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
            >
              {isPending ? 'Submitting Contribution...' : `Confirm Contribution (${amount || 0} PKR)`}
            </button>
          </form>

          {/* Centered Error Overlay Dialog */}
          {error && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setError('')}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <div
                className="relative bg-[#0a0a0f] border border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(220,38,38,0.3)] text-center space-y-4"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide">Contribution Error</h3>
                <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  OK, Got It
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: HONOR ROLL WALL OF SUPPORTERS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white uppercase font-heading flex items-center gap-2">
                  🏆 Honor Roll
                </h2>
                <p className="text-gray-400 text-xs mt-1">Community supporters & sponsors</p>
              </div>
              <span className="bg-red-500/10 text-red-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-red-500/30">
                {contributions.length} Total
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {contributions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 space-y-2">
                  <Heart className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="font-bold text-sm">Be the first community supporter!</p>
                </div>
              ) : (
                contributions.map((c: any, idx: number) => {
                  const isAnon = c.is_anonymous || c.contributor_name === 'Anonymous Supporter'
                  return (
                    <motion.div
                      key={c.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/50 border border-white/5 hover:border-white/20 rounded-2xl p-4 space-y-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                            isAnon
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}>
                            {isAnon ? <UserX className="w-5 h-5" /> : c.contributor_name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              {c.contributor_name}
                            </h4>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className="font-black text-emerald-400 font-mono text-sm bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          +{c.amount} PKR
                        </span>
                      </div>

                      {c.message && (
                        <p className="text-xs text-gray-400 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                          "{c.message}"
                        </p>
                      )}
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
