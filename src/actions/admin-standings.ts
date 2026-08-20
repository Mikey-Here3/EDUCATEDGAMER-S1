'use server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function upsertStanding(data: any) {
  try {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase.from('team_standings').insert(data).select('id').single();
    if (error) return { success: false, error: error.message };
    revalidatePath('/');
    revalidatePath('/admin/standings');
    return { success: true, id: result.id };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteStanding(id: string) {
  try {
    const supabase = createAdminClient();
    await supabase.from('team_standings').delete().eq('id', id);
    revalidatePath('/');
    revalidatePath('/admin/standings');
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function upsertKill(data: any) {
  try {
    const supabase = createAdminClient();
    const { data: result, error } = await supabase.from('mvp_kills').insert(data).select('id').single();
    if (error) return { success: false, error: error.message };
    revalidatePath('/');
    revalidatePath('/admin/standings');
    return { success: true, id: result.id };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function deleteKill(id: string) {
  try {
    const supabase = createAdminClient();
    await supabase.from('mvp_kills').delete().eq('id', id);
    revalidatePath('/');
    revalidatePath('/admin/standings');
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}
