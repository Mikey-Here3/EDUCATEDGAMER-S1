import { sql } from '@/lib/db'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ContributionShowcase from '@/components/contribute/contribution-showcase'

export const revalidate = 0

export default async function ContributePage() {
  let contributions: any[] = []
  let totalRaised = 0

  try {
    const [cRows, sumRows] = await Promise.all([
      sql`SELECT * FROM contributions ORDER BY created_at DESC;`,
      sql`SELECT COALESCE(SUM(amount), 0)::int as total FROM contributions WHERE status = 'approved';`,
    ])

    contributions = cRows || []
    totalRaised = sumRows[0]?.total || 0
  } catch (err) {
    console.error('Neon public contributions query error:', err)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <ContributionShowcase
          initialContributions={contributions}
          totalRaised={totalRaised}
        />
      </main>

      <Footer />
    </div>
  )
}
