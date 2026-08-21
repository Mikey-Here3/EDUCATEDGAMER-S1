import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db'

const GOOGLE_CLIENT_ID = (process.env.AUTH_GOOGLE_ID || process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || '').trim()
const GOOGLE_CLIENT_SECRET = (process.env.AUTH_GOOGLE_SECRET || '').trim()

// MUST exactly match what is registered in Google Cloud Console
function getRedirectUri(origin: string): string {
  if (origin && origin.startsWith('http')) {
    return `${origin.replace(/\/$/, '')}/auth/callback`
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://educatedgamers-s1.vercel.app'
  return `${siteUrl}/auth/callback`
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const { searchParams } = url
  const origin = url.origin
  const code = searchParams.get('code')
  const next = searchParams.get('state') || '/register'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const redirectUri = getRedirectUri(origin)

    // 1. Exchange authorization code with Google for Access Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('Google token exchange failed:', JSON.stringify(tokenData))
      return NextResponse.redirect(`${origin}/login?error=token_failed`)
    }

    // 2. Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/login?error=profile_failed`)
    }

    // 3. Upsert user in Neon Database
    const email = googleUser.email.toLowerCase()
    const name = googleUser.name || email.split('@')[0]

    try {
      const existing = await sql`SELECT id FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1;`
      if (existing.length === 0) {
        await sql`INSERT INTO users (email, full_name, role) VALUES (${email}, ${name}, 'player');`
      }
    } catch (dbErr) {
      console.error('Neon user upsert error:', dbErr)
    }

    // 4. Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('eg_user_session', JSON.stringify({
      email,
      name,
      picture: googleUser.picture || '',
      provider: 'google',
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    // 5. Redirect to registration page with autofill info
    const redirectBase = next.startsWith('/') 
      ? (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || origin) + next
      : origin + '/' + next
    
    const autofillParams = new URLSearchParams({ email, name })
    const finalRedirect = redirectBase.includes('?')
      ? `${redirectBase}&${autofillParams}`
      : `${redirectBase}?${autofillParams}`

    return NextResponse.redirect(finalRedirect)
  } catch (err: any) {
    console.error('Google OAuth callback exception:', err)
    return NextResponse.redirect(`${origin}/login?error=oauth_error`)
  }
}
