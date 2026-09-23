import { NextResponse } from "next/server";

// Any route under /products requires a logged-in user. We check for the
// "token" cookie that the login page sets after a successful login.
// This runs on the server before the page renders, so an unauthenticated
// user is redirected before they ever see product data.
const PROTECTED_PREFIX = "/products";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Send the user back to where they were trying to go after they log in.
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*"],
};
