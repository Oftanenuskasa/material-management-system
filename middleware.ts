import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  // Get the pathname
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Public paths (no auth required)
  const publicPaths = ['/auth/login', '/api/auth', '/_next', '/favicon.ico']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Check for auth cookie
  const cookieHeader = request.headers.get('cookie') || ''
  const hasAuthCookie = 
    cookieHeader.includes('next-auth.session-token') ||
    cookieHeader.includes('__Secure-next-auth.session-token')
  
  // If it's a public path, allow access
  if (isPublicPath || pathname === '/') {
    // If user is logged in and tries to access login, redirect to dashboard
    if (pathname.startsWith('/auth/login') && hasAuthCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }
  
  // If not public path and no auth cookie, redirect to login
  if (!hasAuthCookie) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/manager/:path*',
    '/staff/:path*',
    '/materials/:path*',
    '/requests/:path*',
    '/settings/:path*'
  ]
}
