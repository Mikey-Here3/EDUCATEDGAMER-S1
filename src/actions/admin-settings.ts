'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(tournamentId: string, updates: any) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('tournaments')
      .update(updates)
      .eq('id', tournamentId)
      
    if (error) {
      console.error('Failed to update tournament:', error)
      return { success: false, error: error.message }
    }
    
    revalidatePath('/admin/settings')
    revalidatePath('/')
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
