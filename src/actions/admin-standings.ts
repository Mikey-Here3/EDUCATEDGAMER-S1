'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function upsertStanding(data: any) {
  try {
    const res = await sql`
      INSERT INTO team_standings (team_name, kills, points)
      VALUES (${data.team_name}, ${data.kills || 0}, ${data.points || 0})
      RETURNING id;
    `
    revalidatePath('/')
    revalidatePath('/admin/standings')
    return { success: true, id: res[0].id }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function deleteStanding(id: string) {
  try {
    await sql`DELETE FROM team_standings WHERE id = ${id};`
    revalidatePath('/')
    revalidatePath('/admin/standings')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function upsertKill(data: any) {
  try {
    const res = await sql`
      INSERT INTO mvp_kills (player_name, team_name, kills)
      VALUES (${data.player_name}, ${data.team_name}, ${data.kills || 0})
      RETURNING id;
    `
    revalidatePath('/')
    revalidatePath('/admin/standings')
    return { success: true, id: res[0].id }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function deleteKill(id: string) {
  try {
    await sql`DELETE FROM mvp_kills WHERE id = ${id};`
    revalidatePath('/')
    revalidatePath('/admin/standings')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
