import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  const publicPaths = ["/auth/login", "/"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  if (!token) return NextResponse.redirect("/auth/login");

  if (pathname.startsWith("/admin") && token.role !== "ADMIN")
    return NextResponse.redirect("/auth/login");

  if (pathname.startsWith("/manager") && !["ADMIN","MANAGER"].includes(token.role))
    return NextResponse.redirect("/auth/login");

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/manager/:path*", "/staff/:path*", "/dashboard/:path*"] };
