"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import axiosInstance from "@/app/common/axiosInstance";
import { postCondition } from "../../AIapi";
import Image from "next/image";

const Ai_Step1 = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleGoBack = () => router.back();

  const handleUpload = async (file: File) => {
    setLoading(true); // 로딩 시작
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await postCondition(res.data, id as string); // AI 분석 호출
      localStorage.setItem("aiResult", JSON.stringify(data));
      router.push(`/ai/step2/${id}`); // 결과 페이지 이동
    } catch (err) {
      console.error("❌ 이미지 업로드 실패:", err);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setLoading(false); // 실패 시에도 로딩 종료
    }
  };

  const handleClick = () => {
    inputRef.current?.click(); // 파일 입력창 클릭
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file); // 파일 업로드 시작
    }
  };

  // ✅ 로딩 화면 표시
  if (loading) {
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
            반려동물 상태 공유
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-0.5 bg-yellow-400 mb-16" />

        {/* 뺑글 로딩 */}
        <div className="w-full flex justify-center items-center">
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
  }

  // ✅ 기본 업로드 화면
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
          className="w-full max-w-[600px] h-14 sm:h-16 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-lg sm:text-xl font-['NanumSquareRound'] transition-all duration-300"
        >
          사진 업로드
        </button>
      </div>
    </div>
  );
};

export default Ai_Step1;
