'use client'

import { useState } from 'react'
import { updateSettings } from '@/actions/admin-settings'
import { TOURNAMENT_ID } from '@/lib/constants'
import { Save, CheckCircle2, XCircle, Calendar, Clock, Trophy, Map, Users, Settings2, Radio } from 'lucide-react'

export default function SettingsForm({ tournament }: { tournament: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const [formData, setFormData] = useState({
    status: tournament?.status || 'upcoming',
    registration_open: tournament?.registration_open ?? true,
    prize_pool: tournament?.prize_pool || '1500 Rs',
    map: tournament?.map || 'Bermuda, Purgatory, Solara, NexTerra, Kalahari',
    game_mode: tournament?.game_mode || 'Battle Royale (Squad)',
    max_teams: tournament?.max_teams || 12,
    date: tournament?.date ? tournament.date.slice(0, 10) : '',
    time: tournament?.time ? tournament.time.slice(0, 5) : '',
    registration_deadline: tournament?.registration_deadline ? tournament.registration_deadline.slice(0, 16) : '',
  })

  const set = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')
    setErrMsg('')
    try {
      const payload: any = {
        ...formData,
        max_teams: Number(formData.max_teams),
        date: formData.date || null,
        time: formData.time || null,
        registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : null,
      }
      const res = await updateSettings(TOURNAMENT_ID, payload)
      if (res.success) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setErrMsg(res.error || 'Unknown error')
      }
    } catch (err: any) {
      setStatus('error')
      setErrMsg(err.message || 'Failed to update')
    } finally {
      setIsLoading(false)
    }
  }

  const inputCls = 'w-full bg-black/60 border border-white/10 focus:border-[#DC2626]/60 focus:ring-0 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors'
  const labelCls = 'block text-xs font-black uppercase tracking-widest text-gray-400 mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Status & Registration Toggle */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#DC2626]" /> Tournament Control
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tournament Status</label>
            <select
              className={inputCls + ' cursor-pointer'}
              value={formData.status}
              onChange={e => set('status', e.target.value)}
            >
              <option value="announced">📢 Announced</option>
              <option value="upcoming">⏳ Upcoming</option>
              <option value="ongoing">🔴 Ongoing (LIVE)</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Max Teams</label>
            <input
              type="number"
              min={1} max={64}
              className={inputCls}
              value={formData.max_teams}
              onChange={e => set('max_teams', e.target.value)}
            />
          </div>
        </div>

        {/* Registration Open Toggle */}
        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-3">
          <div>
            <p className="text-white font-bold text-sm">Registration Open</p>
            <p className="text-gray-500 text-xs">Toggle to open or close team registration globally</p>
          </div>
          <button
            type="button"
            onClick={() => set('registration_open', !formData.registration_open)}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${formData.registration_open ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.registration_open ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Schedule Details */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#DC2626]" /> Schedule & Logistics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              <Calendar className="w-3 h-3 inline mr-1" /> Tournament Date
            </label>
            <input
              type="date"
              className={inputCls + ' [color-scheme:dark]'}
              value={formData.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>
              <Clock className="w-3 h-3 inline mr-1" /> Tournament Time
            </label>
            <input
              type="time"
              className={inputCls + ' [color-scheme:dark]'}
              value={formData.time}
              onChange={e => set('time', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>
            <Clock className="w-3 h-3 inline mr-1" /> Registration Deadline
          </label>
          <input
            type="datetime-local"
            className={inputCls + ' [color-scheme:dark]'}
            value={formData.registration_deadline}
            onChange={e => set('registration_deadline', e.target.value)}
          />
          <p className="text-gray-600 text-[11px] mt-1.5">Once this deadline passes, the form closes automatically.</p>
        </div>
      </div>

      {/* Game Settings */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#DC2626]" /> Rewards & Game Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Prize Pool</label>
            <input
              type="text"
              className={inputCls}
              value={formData.prize_pool}
              onChange={e => set('prize_pool', e.target.value)}
              placeholder="e.g. 1500 Rs"
            />
          </div>
          <div>
            <label className={labelCls}>Game Mode</label>
            <input
              type="text"
              className={inputCls}
              value={formData.game_mode}
              onChange={e => set('game_mode', e.target.value)}
              placeholder="Battle Royale (Squad)"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Maps Rotation</label>
          <input
            type="text"
            className={inputCls}
            value={formData.map}
            onChange={e => set('map', e.target.value)}
            placeholder="Bermuda, Purgatory, Solara, NexTerra, Kalahari"
          />
        </div>
      </div>

      {/* Save Button & Feedback */}
      <div className="flex flex-col gap-3">
        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2 text-green-400 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" /> Tournament settings saved successfully! Changes are now live on the website.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2 text-red-400 text-sm font-bold">
            <XCircle className="w-4 h-4" /> {errMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving changes...' : 'Save Tournament Settings'}
        </button>
      </div>
    </form>
  )
}
