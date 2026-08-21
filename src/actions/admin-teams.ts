'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateTeamStatus(teamId: string, status: string) {
  try {
    await sql`
      UPDATE teams
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${teamId};
    `
    revalidatePath('/')
    revalidatePath('/teams')
    revalidatePath('/admin/teams')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTeam(teamId: string) {
  try {
    await sql`DELETE FROM teams WHERE id = ${teamId};`
    revalidatePath('/')
    revalidatePath('/teams')
    revalidatePath('/admin/teams')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
