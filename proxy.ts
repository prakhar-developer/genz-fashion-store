import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is an admin route (but not the login page)
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin/login';

  if (isAdminRoute) {
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');

    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
