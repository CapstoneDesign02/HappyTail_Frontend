"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const Ai_Step2 = () => {
  const router = useRouter();

  const handleGoBack = () => router.back();

  return (
    <div className="w-full min-w-[450px] min-h-screen flex-wrap bg-white mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* 타이틀 */}
      <div className="flex items-center mb-12">
        <button onClick={handleGoBack}>
          <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
            <span className="text-3xl font-extrabold">{"<"}</span>
          </div>
        </button>
        <div className="ml-4 text-3xl sm:text-4xl whitespace-nowrap font-extrabold text-black font-['NanumSquareRound']">
          반려동물 상태 공유
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-0.5 bg-yellow-400 mb-16" />

      {/* 뺑글 */}
      <div className="w-50 h-50 flex items-center justify-center ">
        <Image
          src="/img/Spinner.svg"
          alt="loading"
          width={300}
          height={300}
          className="animate-spinSlow"
          unoptimized
        />
      </div>

      {/* 설명 */}
      <div className="flex justify-center my-12">
        <div className="text-center text-xl whitespace-nowrap sm:text-2xl font-normal text-black font-['NanumSquareRound']">
          <ol>
            <li className="my-2">AI가 열심히 사진을 분석하고 있어요.</li>
            <li className="my-2">화면을 나가지 말고 조금만 기다려주세요.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Ai_Step2;
