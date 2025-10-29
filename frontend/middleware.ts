import { NextResponse, type NextRequest } from "next/server";

// Simple auth guard using a lightweight cookie set on login
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuth = Boolean(req.cookies.get("access_token")?.value);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/cart");

  // If unauthenticated and accessing protected pages → redirect to login
  if (!isAuth && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated and on auth pages → redirect to home
  if (isAuth && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
