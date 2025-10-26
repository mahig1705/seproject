import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  
  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access login/register, redirect to dashboard
  if (accessToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
