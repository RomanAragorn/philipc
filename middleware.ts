import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./app/lib/session";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const cookie = await cookies();
  
  const session = cookie.get('session')?.value;

  const decryptedSession = await decrypt(session);

  const protectedRoutes = [`/users/${decryptedSession?.userId}`];
  const publicRoutes = ["/login", "/signup"];

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isProtectedRoute && !decryptedSession?.userId) {
    return NextResponse.redirect(new URL(`/login`, req.nextUrl))
  }

  if (isPublicRoute && decryptedSession?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next()
};

export async function isLoggedIn() {
  const cookie = await cookies();
  
  const session = cookie.get('session')?.value;

  console.log(session);

  return session ? true : false;
}