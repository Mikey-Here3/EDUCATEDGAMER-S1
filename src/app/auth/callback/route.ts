import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db'

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET || ''

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('state') || searchParams.get('next') || '/register'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const redirectUri = `${origin}/auth/callback`

    // 1. Exchange code with Google for Access Token
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
      console.error('Google token exchange error:', tokenData)
      return NextResponse.redirect(`${origin}/login?error=token_failed`)
    }

    // 2. Fetch User Profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/login?error=profile_failed`)
    }

    // 3. Upsert user in Neon Database
    const email = googleUser.email.toLowerCase()
    const name = googleUser.name || googleUser.email.split('@')[0]

    try {
      const existing = await sql`SELECT id FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1;`
      if (existing.length === 0) {
        await sql`
          INSERT INTO users (email, full_name, role)
          VALUES (${email}, ${name}, 'player');
        `
      }
    } catch (dbErr) {
      console.error('Neon user upsert error:', dbErr)
    }

    // 4. Set Session Cookie
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Forwarding to destination (e.g. /register?captainEmail=...&captainName=...)
    const autofillParams = new URLSearchParams({
      email,
      name,
    })

    const redirectTarget = next.includes('?') 
      ? `${origin}${next}&${autofillParams.toString()}`
      : `${origin}${next}?${autofillParams.toString()}`

    return NextResponse.redirect(redirectTarget)
  } catch (err: any) {
    console.error('Google callback exception:', err)
    return NextResponse.redirect(`${origin}/login?error=oauth_error`)
  }
}
