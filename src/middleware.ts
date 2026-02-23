import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Redirect root to Spaces explore
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/spaces/explore", request.url))
  }
  return NextResponse.next()
}
