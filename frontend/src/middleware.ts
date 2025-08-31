import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {decrypt} from "@/app/actions/session/session";

const publicRoutes = ['/signin', '/signup', '/signin/form', '/signup/form'];

export default async function middleware(req: NextRequest) {
  const path: string = req.nextUrl.pathname;
  const isPublicRoute: boolean = publicRoutes.includes(path);

  const cookie = (await cookies()).get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;
  if (session?.userId) {
    console.log("✅ JWT session detected:", session.userId);
  }

  const isLoggedIn: boolean = Boolean(session?.userId);

  if (!isPublicRoute && !isLoggedIn) {
    console.log("🔄 Redirecting unauthenticated user to /signin");
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if (isPublicRoute && isLoggedIn) {
    console.log("🔄 Redirecting authenticated user to /");
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
