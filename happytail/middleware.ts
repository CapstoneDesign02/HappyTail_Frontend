import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value ?? null;

  // 정적 파일 요청 및 특정 경로 예외 처리
  if (
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.startsWith("/static/") ||
    req.nextUrl.pathname.endsWith(".js") ||
    req.nextUrl.pathname.endsWith(".json") ||
    req.nextUrl.pathname.endsWith(".ico") ||
    req.nextUrl.pathname.startsWith("/info") ||
    req.nextUrl.pathname.startsWith("/login/callback") ||
    req.nextUrl.pathname.startsWith("/join") ||
    req.nextUrl.pathname.startsWith("/img")
  ) {
    return NextResponse.next();
  }

  //토큰이 없으면 "/info"로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL("/info", req.url));
  }

  return NextResponse.next();
}

// 모든 페이지 보호, 정적 파일 및 예외 처리된 경로 제외
export const config = {
  matcher: ["/:path*"],
};
