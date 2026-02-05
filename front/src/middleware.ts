import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/adm")) {
    const key = req.nextUrl.searchParams.get("key");

    if (key !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
