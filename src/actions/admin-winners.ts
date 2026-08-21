'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function upsertWinner(data: any) {
  try {
    const res = await sql`
      INSERT INTO winners (position, team_name, prize)
      VALUES (${data.position}, ${data.team_name}, ${data.prize})
      RETURNING id;
    `
    revalidatePath('/')
    revalidatePath('/admin/winners')
    return { success: true, id: res[0].id }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function deleteWinner(id: string) {
  try {
    await sql`DELETE FROM winners WHERE id = ${id};`
    revalidatePath('/')
    revalidatePath('/admin/winners')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
