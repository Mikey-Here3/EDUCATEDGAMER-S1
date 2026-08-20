'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTeamStatus(teamId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('teams')
    .update({ status })
    .eq('id', teamId)
    
  if (error) {
    console.error('Failed to update team status:', error)
    throw new Error('Failed to update status')
  }
  
  revalidatePath('/admin/teams')
  revalidatePath('/admin')
}

export async function deleteTeam(teamId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId)
    
  if (error) {
    console.error('Failed to delete team:', error)
    throw new Error('Failed to delete team')
  }
  
  revalidatePath('/admin/teams')
  revalidatePath('/admin')
}
