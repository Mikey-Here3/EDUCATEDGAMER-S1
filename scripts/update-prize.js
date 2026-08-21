const { neon } = require('@neondatabase/serverless')
const sql = neon('postgresql://neondb_owner:npg_vfk8r7bpSLsD@ep-restless-hat-b3bms7fa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require')

async function run() {
  console.log('Updating prize_pool in Neon DB...')
  try {
    await sql`UPDATE tournaments SET prize_pool = '1000 Rs' WHERE id = 'a0000000-0000-0000-0000-000000000001';`
    console.log('✅ Prize pool updated to 1000 Rs in DB!')
  } catch (err) {
    console.error('Error updating prize pool:', err)
  }
}

run()
