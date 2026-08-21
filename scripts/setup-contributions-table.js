const { neon } = require('@neondatabase/serverless')
const databaseUrl = 'postgresql://neondb_owner:npg_vfk8r7bpSLsD@ep-restless-hat-b3bms7fa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

async function run() {
  console.log('Creating contributions table in Neon DB...')
  const sql = neon(databaseUrl)

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contributions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contributor_name TEXT NOT NULL,
        is_anonymous BOOLEAN DEFAULT false,
        amount INT NOT NULL,
        payment_method TEXT DEFAULT 'JazzCash',
        proof_url TEXT,
        message TEXT,
        status TEXT DEFAULT 'approved',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    console.log('✅ Contributions table created successfully!')
  } catch (err) {
    console.error('Error creating table:', err)
  }
}

run()
