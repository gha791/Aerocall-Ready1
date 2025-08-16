
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/contacts', '/messages', '/voicemail', '/analytics', '/settings'];
const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password'];

async function verifySession(sessionCookie: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verify`, {
            headers: {
                'Cookie': `session=${sessionCookie}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error("Session verification failed:", error);
        return false;
    }
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // If there's no session cookie and the user is trying to access a protected route
  if (!sessionCookie && PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (sessionCookie) {
      const isValid = await verifySession(sessionCookie);

      if (isValid) {
        // If the user is authenticated and tries to access a public route like login/signup,
        // redirect them to the dashboard.
        if (PUBLIC_ROUTES.includes(pathname) || pathname === '/') {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
      } else {
        // Session cookie is invalid. Clear it and redirect to login if not already on a public page.
        if (PROTECTED_ROUTES.some(p => pathname.startsWith(p))) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.set('session', '', { maxAge: -1 });
            return response;
        }
      }
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
