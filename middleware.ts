import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data } = await supabase.auth.getSession()

  // Check auth condition for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/room') || 
                           request.nextUrl.pathname.startsWith('/create') ||
                           request.nextUrl.pathname.startsWith('/latest')

  // Redirect if accessing protected route without auth
  if (isProtectedRoute && !data.session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect if accessing login/signup when already authenticated
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && data.session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public image files)
     * - api/webhooks (webhooks)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api/webhooks).*)',
  ],
}
