"use client";
import { useRouter } from "next/navigation";

const KAKAO_CLIENT_ID = "0ab38ede5852ba1a717d09d3c5c4001b"; // 카카오 REST API 키
const REDIRECT_URI = "http://localhost:3000/login/callback"; // 프론트 콜백 URL

const KakaoLogin = () => {
  const router = useRouter();

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    router.push(kakaoAuthUrl);
  };

  return <button onClick={handleLogin}>카카오 로그인</button>;
};

export default KakaoLogin;
