import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard/user'
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const origin = requestUrl.origin

      // Check if this is a password recovery/reset flow
      if (type === 'recovery') {
        // Set a cookie to mark this as a recovery session
        const response = NextResponse.redirect(new URL('/auth/reset-password?from=recovery', origin))
        response.cookies.set('needs_password_reset', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 // 1 hour
        })
        return response
      }

      // Check if this is an email verification (signup) or other type
      if (type === 'signup' || data.session?.user.email_confirmed_at) {
        // Email verified successfully, redirect to dashboard with success message
        const redirectUrl = new URL(next, origin)
        return NextResponse.redirect(redirectUrl)
      }

      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // If there's an error or no code, redirect to auth page
  return NextResponse.redirect(new URL('/auth?error=auth-callback-failed', requestUrl.origin))
}
