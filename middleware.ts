import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/users")) {
    try {
      const user = JSON.parse(atob(session));

      if (user.role !== "admin") {
        const url = new URL("/unauthorized", req.url);
        url.searchParams.set("message", "Access denied. Admins only.");
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Session parsing error:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/users"],
};
