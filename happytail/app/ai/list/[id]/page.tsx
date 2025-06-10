"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AnalysisEntry, getConditionList } from "../../AIapi";

export default function AiResultList() {
  const { id } = useParams();
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [list, setList] = useState<AnalysisEntry[]>([]);
  const router = useRouter();

  const handleGoBack = () => router.back();

  useEffect(() => {
    const fetchList = async () => {
      const data = await getConditionList(id as string);
      setList(data);
    };
    fetchList();
  }, [id]);

  return (
    <div className="w-full min-w-[400px] min-h-screen flex-wrap bg-white mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
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

      {/* 리스트 렌더링 */}
      {list.length === 0 ? (
        <div className="text-center text-gray-500 mb-16">
          아직 기록이 없습니다.
        </div>
      ) : (
        list.map((entry) => (
          <div
            key={entry.id}
            className="flex gap-4 mb-8 items-start border-b pb-6 border-amber-400 last:border-none"
          >
            {/* 이미지 */}
            <div
              className="cursor-pointer"
              onClick={() => setModalUrl(entry.fileUrl)}
            >
              <Image
                src={entry.fileUrl}
                alt={`예약 ID ${entry.resevationId}에 대한 예측 결과 이미지`}
                width={96}
                height={96}
                className="object-cover rounded-md"
                unoptimized // 외부 URL에서 최적화 없이 바로 출력
              />
            </div>

            {/* 내용 */}
            <div className="w-full flex flex-col justify-between items-start h-full relative">
              <div className="flex-1 text-lg text-gray-800 whitespace-pre-line mb-2">
                {entry.predictedDisease}
              </div>
              <div className="text-base text-gray-600 mb-2">
                예측 확률: {entry.predictedProbability * 100}%
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {new Date(entry.predictedDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            {/*프로필 사진*/}
            <div className="flex items-center justify-center gap-5 w-[300px]">
              <img
                src={entry.userInfo?.file?.url ?? "/img/profile.jpeg"}
                alt="작성자 이미지"
                className="w-20 h-20 rounded-full  object-cover"
              />
              <div className="text-lg font-bold text-gray-700">
                {entry.userInfo?.nickname || "익명"}
              </div>
            </div>
          </div>
        ))
      )}

      {/* 공통 버튼 – 피부질환 분석으로 이동 */}
      <div className="w-full flex justify-center mt-20">
        <button
          onClick={() => router.push("/ai/step1/" + id)}
          className="h-14 sm:h-16 px-10 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-lg"
        >
          반려동물 피부질환 하러가기
        </button>
      </div>

      {/* 이미지 모달 */}
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
