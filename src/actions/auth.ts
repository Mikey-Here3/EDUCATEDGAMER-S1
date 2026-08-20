'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function getGoogleAuthUrl(nextUrl: string = '/') {
  try {
    const supabase = await createClient()
    const headerList = await headers()
    const host = headerList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`
    
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, url: data.url }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function signInWithEmailAction(formData: { email: string; password: string }) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    return { success: true, user: data.user }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function signUpWithEmailAction(formData: { 
  email: string; 
  password: string; 
  fullName: string;
  freeFireUid?: string;
}) {
  try {
    const supabase = await createClient()
    const headerList = await headers()
    const host = headerList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: formData.fullName,
          free_fire_uid: formData.freeFireUid || '',
        }
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { 
      success: true, 
      user: data.user, 
      needsEmailConfirmation: !data.session 
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function signOutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
