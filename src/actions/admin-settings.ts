'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateTournament(data: {
  max_teams?: number
  prize_pool?: string
  status?: string
  registration_open?: boolean
  map?: string
  game_mode?: string
}) {
  try {
    await sql`
      UPDATE tournaments
      SET 
        max_teams = COALESCE(${data.max_teams}, max_teams),
        prize_pool = COALESCE(${data.prize_pool}, prize_pool),
        status = COALESCE(${data.status}, status),
        registration_open = COALESCE(${data.registration_open}, registration_open),
        map = COALESCE(${data.map}, map),
        game_mode = COALESCE(${data.game_mode}, game_mode),
        updated_at = NOW();
    `
    revalidatePath('/')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateSettings(tournamentId: string, data: any) {
  return await updateTournament(data)
}
