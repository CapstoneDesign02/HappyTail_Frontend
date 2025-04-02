"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/app/common/cookie";

function LoginCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) return;

    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ID}/auth/kakao?code=${code}`
        );
        const data = await response.json();

        if (data.isLogin) {
          if (data.token) {
            setCookie("token", data.token);
            router.push("/");
          } else {
            console.error("❌ 토큰이 없습니다.");
          }
        } else {
          if (data.email) {
            router.push(`/join?email=${data.email}`);
          } else {
            console.error("❌ 이메일 정보가 없습니다.");
          }
        }
      } catch (error) {
        console.error("❌ 로그인 실패:", error);
      }
    };

    fetchToken();
  }, [code, router]);

  return null; // No UI needed while processing
}

export default function LoginCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginCallbackContent />
    </Suspense>
  );
}
