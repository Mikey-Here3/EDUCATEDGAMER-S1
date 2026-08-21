'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { headers, cookies } from 'next/headers'

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID || ''

// Master Admin Credentials
const ADMIN_EMAILS = ['admin@educatedgamer.com', 'ashanmirofficial@gmail.com']
const ADMIN_PASSWORDS = ['EG@Admin2026!', 'EG@Admin2024!', 'admin123']

// IMPORTANT: This redirect URI must EXACTLY match what you entered in Google Cloud Console
function getRedirectUri(origin: string) {
  // On production Vercel, use the canonical site URL to avoid mismatches
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') 
  if (siteUrl && !origin.includes('localhost')) {
    return `${siteUrl}/auth/callback`
  }
  return `${origin}/auth/callback`
}

export async function getGoogleAuthUrl(nextUrl: string = '/register') {
  try {
    const headerList = await headers()
    const host = headerList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`
    
    const redirectUri = getRedirectUri(origin)

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: nextUrl,
    })

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    return { success: true, url: googleAuthUrl }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function adminLoginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Please enter both email and password.' }
  }

  // Check master admin credentials or Neon database
  const isValidMaster = ADMIN_EMAILS.includes(email) && ADMIN_PASSWORDS.includes(password)

  if (isValidMaster) {
    const cookieStore = await cookies()
    cookieStore.set('eg_admin_session', JSON.stringify({ email, role: 'admin', loggedAt: Date.now() }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return { success: true }
  }

  // Check in Neon users table
  try {
    const users = await sql`
      SELECT * FROM users WHERE LOWER(email) = LOWER(${email}) AND role = 'admin' LIMIT 1;
    `
    if (users.length > 0 && users[0].password_hash === password) {
      const cookieStore = await cookies()
      cookieStore.set('eg_admin_session', JSON.stringify({ email, role: 'admin', loggedAt: Date.now() }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return { success: true }
    }
  } catch (err) {
    console.error('Neon admin check error:', err)
  }

  return { success: false, error: 'Invalid admin credentials. Please verify your email and password.' }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('eg_admin_session')
  revalidatePath('/')
  return { success: true }
}

export async function signInWithEmailAction(formData: { email: string; password: string }) {
  try {
    const email = formData.email.trim().toLowerCase()
    const users = await sql`
      SELECT * FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1;
    `
    if (users.length > 0 && users[0].password_hash === formData.password) {
      const cookieStore = await cookies()
      cookieStore.set('eg_user_session', JSON.stringify({ email, name: users[0].full_name }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return { success: true, user: users[0] }
    }
    return { success: false, error: 'Invalid email or password.' }
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
    const email = formData.email.trim().toLowerCase()
    
    // Check if user already exists in Neon
    const existing = await sql`SELECT id FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1;`
    if (existing.length > 0) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const inserted = await sql`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES (${email}, ${formData.password}, ${formData.fullName}, 'player')
      RETURNING id, email, full_name;
    `

    const cookieStore = await cookies()
    cookieStore.set('eg_user_session', JSON.stringify({ email, name: formData.fullName }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return { success: true, user: inserted[0] }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
