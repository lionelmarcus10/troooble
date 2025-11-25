import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/auth')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isPublicRoute = pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')

  // ==========================================
  // AUTHENTICATION PROTECTION
  // ==========================================

  // Protect all /dashboard routes - require authentication
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users trying to access protected routes (not dashboard, not auth, not public)
  if (!user && !isAuthRoute && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // ==========================================
  // RECOVERY SESSION PROTECTION
  // ==========================================

  // Check if user is trying to access dashboard with a recovery/temporary session
  // Recovery sessions are created when users click password reset links
  // Note: Supabase creates a temporary session when users click password reset links
  // This session should only allow access to the password reset page
  if (user && session && isDashboardRoute) {
    // Check if this is a recovery session by looking at user metadata or session properties
    const userMetadata = user.user_metadata as Record<string, unknown>
    const appMetadata = user.app_metadata as Record<string, unknown>

    // Recovery sessions typically have specific metadata or the user came from a recovery flow
    // We can check if the user has recently used a recovery token
    if (appMetadata?.recovery_sent_at || userMetadata?.is_recovery) {
      const recoverySentAt = appMetadata?.recovery_sent_at as string | undefined
      if (recoverySentAt) {
        const recoveryTime = new Date(recoverySentAt).getTime()
        const currentTime = Date.now()
        const oneHour = 60 * 60 * 1000

        // If recovery was sent less than 1 hour ago, treat as recovery session
        if (currentTime - recoveryTime < oneHour) {
          const url = request.nextUrl.clone()
          url.pathname = '/auth/reset-password'
          url.searchParams.set('from', 'recovery')
          return NextResponse.redirect(url)
        }
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}