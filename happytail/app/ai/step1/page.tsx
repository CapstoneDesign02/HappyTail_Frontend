"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import axiosInstance from "@/app/common/axiosInstance";

const Ai_Step1 = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleGoBack = () => router.back();

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/ai/step2");
    } catch (err) {
      console.error("❌ 이미지 업로드 실패:", err);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click(); // 사진 촬영
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file); // 촬영된 사진 업로드
    }
  };

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

      {/* 설명 */}
      <div className="flex justify-center mb-8">
        <div className="text-xl sm:text-2xl whitespace-nowrap font-normal text-black font-['NanumSquareRound']">
          <ol>
            <li className="my-2">1. 반려동물의 피부 상태를 사진 촬영합니다.</li>
            <li className="my-2">2. AI가 간단한 피부 질환을 분석합니다.</li>
            <li className="my-2">3. 결과 확인 후 예약 확정!</li>
          </ol>
        </div>
      </div>

      {/* 히든 파일 입력 */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 사진 버튼 */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full max-w-[600px] h-14 sm:h-16 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-lg sm:text-xl font-['NanumSquareRound'] transition-all duration-300"
        >
          {loading ? "업로드 중..." : "사진 촬영 시작"}
        </button>
      </div>
    </div>
  );
};

export default Ai_Step1;
