import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  if (session) {
    if (!pathname.startsWith("/admin")) {
      const url = new URL("/admin", request.url);
      url.searchParams.set(
        "message",
        "Silakan logout terlebih dahulu untuk mengakses halaman publik."
      );
      return NextResponse.redirect(url);
    }
  } else {
    if (pathname.startsWith("/admin")) {
      const url = new URL("/login", request.url);
      url.searchParams.set("message", "Anda harus login terlebih dahulu.");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
