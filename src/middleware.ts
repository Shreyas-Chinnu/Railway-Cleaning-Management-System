import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to the home and login pages without authentication
  if (path === '/' || path === '/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // If no token or userRole is found, redirect to the login page
  if (!token || !userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect users to their respective dashboards based on their role
  if (path.startsWith('/dashboard')) {
    if (userRole === 'admin' && !path.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else if (userRole === 'worker' && !path.startsWith('/dashboard/worker')) {
      return NextResponse.redirect(new URL('/dashboard/worker', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
  ],
};
