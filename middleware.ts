import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");
    const isRootRoute = req.nextUrl.pathname === "/";
    if (isRootRoute) {
      return NextResponse.redirect(new URL("/conversations", req.url));
    }

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/conversations", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // this is a work-around for handling redirect  on auth pages.
        // We return true here so that the middleware function above
        // is always called
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/users/:path*", "/login", "/register", "/conversations/:path*"],
};
