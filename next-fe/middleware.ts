import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected paths that require authentication
const protectedPaths = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path is in the protected paths list
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  if (isProtectedPath) {
    // Check for the presence of an accessToken cookie
    const accessToken = request.cookies.get('accessToken')?.value
    
    // If no accessToken is found, redirect to login
    if (!accessToken) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}