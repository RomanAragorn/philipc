import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from './app/lib/session';

export default async function middleware(req: NextRequest): Promise<NextResponse> {
    const path = req.nextUrl.pathname;
    const cookie = await cookies();
    const session = cookie.get('session')?.value;
    const decryptedSession = await decrypt(session);
    const isAuthenticated = !!decryptedSession?.userId;

    // Protected routes that require authentication
    const protectedPaths = ['/sell', '/settings', '/profile'];
    const isProtectedRoute = protectedPaths.some((route) => path.startsWith(route));

    // Auth routes that logged-in users shouldn't access
    const authPaths = ['/login', '/signup'];
    const isAuthRoute = authPaths.some((route) => path.startsWith(route));

    // Redirect unauthenticated users to login
    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
