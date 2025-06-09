"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnalysisEntry } from "../../AIapi";

const Ai_Step3 = () => {
  const { id } = useParams();
  const router = useRouter();
  const [aiResult, setAiReuslt] = useState<AnalysisEntry>();

  useEffect(() => {
    const stored = localStorage.getItem("aiResult");
    if (stored) {
      setAiReuslt(JSON.parse(stored));
      console.log("AI Result:", JSON.parse(stored));
    } else {
      router.push("/ai/list/" + id);
    }
  }, [router]);

  const handleGoBack = () => router.back();

  return (
    <div className="w-full w-min-[400px]  min-h-screen flex-wrap bg-white mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* 타이틀 */}
      <div className="flex items-center mb-6">
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

      {/* 결과 사진 */}
      <div className="w-50 h-50 flex items-center justify-center ">
        <Image
          src={aiResult?.fileUrl || "/img/poppy.png"}
          alt={aiResult?.resevationId || "AI Result"}
          width={300}
          height={300}
          className=""
          unoptimized
        />
      </div>

      {/* 설명 */}
      {aiResult && (
        <div className="flex justify-center my-12">
          <div className="text-center text-xl whitespace-nowrap sm:text-2xl font-normal text-black font-['NanumSquareRound']">
            <ol>
              <li className="my-2">{}</li>
              <li className="my-2">
                AI가
                {aiResult.predictedProbability * 100}로{" "}
                {aiResult.predictedDisease}
                을(를) 추측해요
              </li>
              <li className="w-[90%] my-20 flex justify-between">
                <div className="flex-[3] font-bold">예측날짜</div>
                <div className="flex-[7] text-right">
                  {aiResult.predictedDate}
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* 사진 버튼 */}
      <div className="flex flex-col items-center">
        <button
          /* 채팅방에 공유하는 로직 추가 필 */
          className="cursor-pointer w-full max-w-[600px] h-14 sm:h-16 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-lg sm:text-xl font-['NanumSquareRound'] transition-all duration-300"
          onClick={() => {
            // 채팅방 공유 로직 추가
            router.push(`/ai/list/${id}`);
          }}
        >
          반려동물 상태확인 리스트로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Ai_Step3;
