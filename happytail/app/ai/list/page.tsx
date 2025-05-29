"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type AnalysisEntry = {
  id: number;
  imageUrl: string;
  resultText: string;
};

export default function AiResultList() {
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleGoBack = () => router.back();

  const results: AnalysisEntry[] = [
    {
      id: 1,
      imageUrl: "/img/poppy.jpg",
      resultText:
        "피부가 약간 붉고 건조합니다. 알레르기 반응 가능성이 있습니다.",
    },
    {
      id: 2,
      imageUrl: "/img/nabi.jpeg",
      resultText: "피부 상태는 양호하나, 털 빠짐이 관찰됩니다. 추가 관리 필요.",
    },
  ];

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
          반려동물 상태 기록
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-0.5 bg-yellow-400 mb-16" />

      {results.map((entry) => (
        <div
          key={entry.id}
          className="flex gap-4 mb-8 items-start border-b pb-6 border-amber-400 last:border-none"
        >
          {/* 이미지 */}
          <div
            className="w-36 h-36 rounded aspect-square overflow-hidden cursor-pointer"
            onClick={() => setModalUrl(entry.imageUrl)}
          >
            <Image
              src={entry.imageUrl}
              alt="분석 이미지"
              width={144}
              height={144}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="w-full flex flex-col justify-between items-start h-full relative">
            {/* 텍스트 */}
            <div className="flex-1 text-lg text-gray-800 whitespace-pre-line">
              {entry.resultText}
            </div>

            {/* 버튼 - 우하단 고정 */}
            <div className="w-full flex justify-end mt-4">
              <button
                // onClick={() => ...}
                className="h-14 sm:h-16 w-32 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg text-base sm:text-lg"
              >
                채팅으로 공유
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 모달 */}
      {modalUrl && (
        <div
          onClick={() => setModalUrl(null)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <div className="max-w-[90vw] max-h-[90vh] overflow-auto">
            <img
              src={modalUrl}
              alt="확대 이미지"
              className="object-contain max-w-full max-h-[90vh] rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
