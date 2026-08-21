import { neon, neonConfig } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

export const sql = databaseUrl ? neon(databaseUrl) : null

export async function queryNeon(queryText: string, params: any[] = []) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured for Neon Database.')
  }
  const neonSql = neon(databaseUrl)
  // Execute parameterized query
  return await (neonSql as any)(queryText, params)
}
