"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InstallPWAButton from "./InstallButton";

const WebPage: React.FC = () => {
  const router = useRouter();

  const KakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_type=code`;
    router.push(kakaoAuthUrl);
  };

  return (
    <div className="max-w-[1920px] w-full min-h-screen relative bg-white overflow-x-hidden flex justify-center items-center">
      {/* 배경 이미지 */}
      <div className="fixed right-0 h-full w-full max-w-[50%] lg:max-w-[40%] md:max-w-[30%]">
        <Image
          className="object-cover h-full w-full"
          src="/img/web.png"
          alt="Background"
          fill
          sizes="(max-width: 768px) 0px, (max-width: 1024px) 30vw, (max-width: 1536px) 40vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/1rem to-transparent"></div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-10 flex flex-col w-full max-w-[800px] px-8 md:px-12 py-8 md:py-12">
        {/* 헤더 텍스트 */}
        <div className="mb-6 md:mb-8 text-black text-xl sm:text-2xl md:text-3xl font-normal font-['Gabia_Gosran']">
          친구 같이, 아이 같이, 가족 같이
          <br />
          당신의 반려동물을 돌봅니다.
        </div>

        {/* 서비스 설명 */}
        <div className="mb-6 md:mb-8 text-yellow-400 text-3xl sm:text-4xl md:text-5xl font-normal font-['NanumSquareRound']">
          따뜻한 손길 서비스,
        </div>

        {/* 로고와 브랜드명 */}
        <div className="mb-8 md:mb-10 flex items-center">
          <Image
            className="w-12 h-auto sm:w-16 md:w-20"
            src="/img/logo-10.png"
            alt="Logo"
            width={80}
            height={85}
          />
          <div className="ml-4 text-amber-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-['Y_Onepick_TTF']">
            행복한 꼬리
          </div>
        </div>

        <InstallPWAButton />

        {/* 카카오 로그인 버튼 */}
        <button
          className="mt-6 md:mt-8 w-full max-w-[400px] h-12 sm:h-14 md:h-16 justify-start relative"
          onClick={KakaoLogin}
        >
          <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-md"></div>
          <div className="absolute inset-0 bg-yellow-300 rounded-2xl flex items-center justify-center">
            <div className="text-black text-opacity-80 text-lg sm:text-xl md:text-2xl font-bold font-['NanumSquareRound']">
              카카오로 시작하기
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WebPage;
