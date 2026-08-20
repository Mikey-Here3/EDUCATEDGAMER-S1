import TeamTable from '@/components/admin/team-table'
import { createClient } from '@/lib/supabase/server'

export default async function AdminTeamsPage() {
  const supabase = await createClient()

  // Fetch teams with their players
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*, players(*)')

  if (error) {
    console.error('Error fetching teams:', error)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
      </div>
      <div className="rounded-md border bg-white p-4">
        <TeamTable initialTeams={teams || []} />
      </div>
    </div>
  )
}
