import { sql } from '@/lib/db'
import WinnersEditor from '@/components/admin/winners-editor'

export const revalidate = 0

export default async function AdminWinnersPage() {
  let winners: any[] = []

  try {
    const wRows = await sql`SELECT * FROM winners ORDER BY position ASC;`
    winners = wRows || []
  } catch (err) {
    console.error('Neon admin winners query error:', err)
  }

  return (
    <div className="flex flex-col gap-6 p-6 text-white max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight font-heading">Championship Winners</h1>
      <WinnersEditor winners={winners} tournamentId="a0000000-0000-0000-0000-000000000001" />
    </div>
  )
}
