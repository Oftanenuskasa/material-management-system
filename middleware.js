import { NextResponse } from 'next/server'

// Allow ALL requests - NO authentication
export function middleware(request) {
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
