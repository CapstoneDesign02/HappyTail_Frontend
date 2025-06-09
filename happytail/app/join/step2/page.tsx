"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { OCRData } from "../mockData";

export default function Step2() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [ocrData, setOcrData] = useState<OCRData | null>(null);

  // 클라이언트에서만 `searchParams` 사용
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("ocrResult");
    if (stored) {
      setOcrData(JSON.parse(stored));
    } else {
      router.push("/join/step1?email=" + email);
    }
  }, [router]);

  const handleNext = () => {
    router.push("/join/step3?email=" + email);
  };

  const handleRetry = () => {
    localStorage.removeItem("ocrResult");
    router.push("/join/step1?email=" + email);
  };

  // If ocrData is null, show a fallback
  if (!ocrData) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading OCR Data...</div>}>
      <div className="w-full min-w-[450px] min-h-screen bg-white mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        {/* 뒤로가기 + 회원가입 */}
        <div className="flex items-center mb-12">
          <button
            onClick={() => router.back()}
            className="size-12 sm:size-14 bg-white shadow-md flex items-center justify-center"
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
              &lt;
            </span>
          </button>
          <div className="ml-4 text-3xl whitespace-nowrap sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            회원가입
          </div>
        </div>

        {/* 로고 + 행복한 꼬리 */}
        <div className="flex flex-col items-center mb-12">
          <img
            src="/img/logo192.png"
            alt="로고"
            className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
          />
          <div className="text-4xl sm:text-6xl whitespace-nowrap font-bold text-amber-800 font-['Y_Onepick_TTF'] text-center">
            행복한 꼬리
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-0.5 bg-yellow-400 mb-16" />

        {/* OCR 결과 확인 */}
        <div className="flex flex-col items-center mb-12 w-full">
          <div className="text-2xl sm:text-4xl whitespace-nowrap font-normal text-black font-['NanumSquareRound'] mb-12 text-center">
            신분증 정보 확인
          </div>

          {ocrData.valid ? (
            <div className="text-2xl sm:text-2xl text-black text-30em flex flex-col gap-8 w-full max-w-2xl">
              {/* 각 항목 */}
              {[
                { label: "이름", value: ocrData.name },
                { label: "성별", value: ocrData.gender === "M" ? "남" : "여" },
                { label: "주민등록번호", value: ocrData.idNumber },
                { label: "주소", value: ocrData.address },
              ].map(({ label, value }, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 font-bold">{label}</div>
                  <div className="mt-1 sm:mt-0 sm:ml-4 break-words">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-2xl sm:text-2xl text-red-500 font-bold">
              OCR 인증에 실패했습니다. 다시 시도해주세요.
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-6 w-full">
          {/* 다시 업로드하기 버튼 (항상 표시) */}
          <button
            onClick={handleRetry}
            className="w-full max-w-2xl h-16 sm:h-20 bg-red-400 hover:bg-red-500 text-white font-bold rounded-lg text-xl sm:text-2xl font-['NanumSquareRound'] transition-all duration-300"
          >
            다시 업로드하기
          </button>

          {/* 다음 단계로 버튼 (ocrData.valid가 true일 때만 표시) */}
          {ocrData.valid && (
            <button
              onClick={handleNext}
              className="w-full max-w-2xl h-16 sm:h-20 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-xl sm:text-2xl font-['NanumSquareRound'] transition-all duration-300"
            >
              다음 단계로
            </button>
          )}
        </div>
      </div>
    </Suspense>
  );
}
