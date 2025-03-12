"use client"; // Next.js App Router에서는 useRouter를 사용하려면 필요

import { useRouter } from "next/navigation";

export const KakaoLogin = () => {
  const router = useRouter();

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_type=code`;
    console.log(kakaoAuthUrl);
    router.push(kakaoAuthUrl);
  };

  return (
    <img
      src="kakao_login.png"
      alt="Kakao Button"
      className="object-cover hover:cursor-pointer"
      onClick={handleLogin}
    />
  );
};
