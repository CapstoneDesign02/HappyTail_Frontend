import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value ?? null;

  // 정적 파일 및 특정 경로 예외 처리
  if (
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.startsWith("/static/") ||
    req.nextUrl.pathname.endsWith(".js") ||
    req.nextUrl.pathname.endsWith(".json") ||
    req.nextUrl.pathname.endsWith(".ico") ||
    req.nextUrl.pathname === "/manifest.json" ||
    req.nextUrl.pathname.startsWith("/info") ||
    req.nextUrl.pathname.startsWith("/login/callback") ||
    req.nextUrl.pathname.startsWith("/join") ||
    req.nextUrl.pathname.startsWith("/img") ||
    req.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 토큰이 없으면 "/info"로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL("/info", req.url));
  }

  return NextResponse.next();
}

// matcher 수정 (정적 파일 예외 처리)
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|manifest.json).*)"],
};
