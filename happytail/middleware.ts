import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("checkAuth: " + token);

  // 토큰이 없으면 "/webpage"로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL("/info", req.url));
  }

  return NextResponse.next();
}

// 모든 페이지를 보호
export const config = {
  matcher: ["/((?!info).*)"], // "/webpage"를 제외한 모든 경로 보호
};
