const { neon } = require('@neondatabase/serverless')
const sql = neon('postgresql://neondb_owner:npg_vfk8r7bpSLsD@ep-restless-hat-b3bms7fa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require')

async function run() {
  console.log('Running DB migrations...')

  try { await sql`ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS date DATE;`; console.log('✅ date column') } catch(e) { console.error('date:', e.message) }
  try { await sql`ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS time TIME;`; console.log('✅ time column') } catch(e) { console.error('time:', e.message) }
  try { await sql`ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ;`; console.log('✅ registration_deadline column') } catch(e) { console.error('deadline:', e.message) }

  console.log('All migrations done!')
}

run()
