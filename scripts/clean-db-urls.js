const { neon } = require('@neondatabase/serverless')
const sql = neon('postgresql://neondb_owner:npg_vfk8r7bpSLsD@ep-restless-hat-b3bms7fa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require')

async function run() {
  console.log('Cleaning corrupted URL entities in Neon database...')

  try {
    const teams = await sql`SELECT id, logo_url, uid_screenshot_url, payment_proof_url FROM teams;`

    for (const team of teams) {
      const cleanLogo = team.logo_url ? team.logo_url.replace(/&#x2F;/g, '/') : null
      const cleanUid = team.uid_screenshot_url ? team.uid_screenshot_url.replace(/&#x2F;/g, '/') : null
      const cleanPayment = team.payment_proof_url ? team.payment_proof_url.replace(/&#x2F;/g, '/') : null

      await sql`
        UPDATE teams
        SET
          logo_url = ${cleanLogo},
          uid_screenshot_url = ${cleanUid},
          payment_proof_url = ${cleanPayment}
        WHERE id = ${team.id};
      `
    }
    console.log('✅ All team image URLs in Neon DB sanitized and restored to clean HTTPS format!')
  } catch (err) {
    console.error('Error cleaning URLs:', err)
  }
}

run()
