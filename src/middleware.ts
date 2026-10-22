import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname === "/es" || pathname.startsWith("/es/") ? "es" : pathname === "/de" || pathname.startsWith("/de/") ? "de" : "en";
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|media|favicon.ico).*)"],
};
