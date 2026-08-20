import { createClient } from '@/lib/supabase/server'
import { TOURNAMENT_ID } from '@/lib/constants'
import SettingsForm from '@/components/admin/settings-form'

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', TOURNAMENT_ID)
    .single()

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full p-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tournament Settings</h1>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#050507] p-6 shadow-xl">
        <SettingsForm tournament={tournament} />
      </div>
    </div>
  )
}
