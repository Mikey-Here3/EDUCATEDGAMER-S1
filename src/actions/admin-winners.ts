'use server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function upsertWinner(data: any) {
  try {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase.from('winners').insert(data).select('id').single();
    if (error) return { success: false, error: error.message };
    revalidatePath('/');
    return { success: true, id: result.id };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteWinner(id: string) {
  try {
    const supabase = createAdminClient();
    await supabase.from('winners').delete().eq('id', id);
    revalidatePath('/');
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}
