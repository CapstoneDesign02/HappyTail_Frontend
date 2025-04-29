"use client";

import { useRouter } from "next/navigation";

export default function JoinComplete() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="w-full min-w-[320px] min-h-screen flex flex-col items-center justify-center bg-white px-6 sm:px-8 lg:px-10">
      {/* 로고 + 문구 */}
      <div className="flex flex-row flex-wrap items-center justify-center mb-12 text-center">
        <img
          src="/img/logo192.png"
          alt="로고"
          className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="text-3xl sm:text-5xl font-bold text-amber-800 font-['Y_Onepick_TTF'] break-words whitespace-normal">
          행복한 꼬리
        </div>
      </div>

      {/* 축하 문구 */}
      <div className="flex justify-center mb-8 px-2 text-center">
        <div className="text-2xl sm:text-3xl font-normal text-black font-['NanumSquareRound'] break-words whitespace-normal">
          가입을 환영합니다!
        </div>
      </div>

      {/* 메인 페이지로 이동 버튼 */}
      <button
        onClick={handleGoHome}
        className="w-full max-w-xs bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-xl sm:text-2xl py-4 transition-all duration-300"
      >
        메인 페이지로 이동
      </button>
    </div>
  );
}
