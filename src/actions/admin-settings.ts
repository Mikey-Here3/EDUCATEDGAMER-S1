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
  date?: string | null
  time?: string | null
  registration_deadline?: string | null
  custom_room_info?: string | null
  announcement?: string | null
}) {
  try {
    await sql`
      UPDATE tournaments
      SET
        max_teams = COALESCE(${data.max_teams ?? null}, max_teams),
        prize_pool = COALESCE(${data.prize_pool ?? null}, prize_pool),
        status = COALESCE(${data.status ?? null}, status),
        registration_open = COALESCE(${data.registration_open ?? null}, registration_open),
        map = COALESCE(${data.map ?? null}, map),
        game_mode = COALESCE(${data.game_mode ?? null}, game_mode),
        date = ${data.date ?? null},
        time = ${data.time ?? null},
        registration_deadline = ${data.registration_deadline ?? null},
        updated_at = NOW();
    `
    revalidatePath('/')
    revalidatePath('/register')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateSettings(tournamentId: string, data: any) {
  return await updateTournament(data)
}
