const { neon } = require('@neondatabase/serverless')

const databaseUrl = 'postgresql://neondb_owner:npg_vfk8r7bpSLsD@ep-restless-hat-b3bms7fa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

async function run() {
  console.log('Migrating live Neon tables to add screenshot columns...')
  const sql = neon(databaseUrl)
  
  try {
    await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS uid_screenshot_url TEXT;`
    await sql`ALTER TABLE teams ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;`
    console.log('✅ Teams table updated successfully with screenshot URL columns!')
  } catch (err) {
    console.error('Migration error:', err)
  }
}

run()
