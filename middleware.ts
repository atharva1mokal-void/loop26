import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // Direct dashboard or root access should require login
    const protectedPaths = ['/', '/dashboard', '/admin', '/projects', '/insights', '/intelligence', '/profile'];
    const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

    if (isProtected && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === '/login' && session) {
        try {
            const sessionData = JSON.parse(session.value);
            if (sessionData.role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));
        } catch (e) {
            // If session is invalid, allow login page
            return NextResponse.next();
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
