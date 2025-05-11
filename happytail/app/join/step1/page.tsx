"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const Step1 = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 클라이언트에서만 `searchParams` 사용
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택하세요.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("ocrResult", JSON.stringify(data));
        router.push("/join/step2?email=" + email);
      } else {
        alert("OCR 실패: " + data.error);
      }
    } catch (err) {
      console.error("서버 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <div className="w-full max-w-4xl min-w-min min-h-screen flex-wrap bg-white mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        {/* 1. 뒤로가기 + 회원가입 */}
        <div className="flex items-center mb-12">
          <div className="size-12 sm:size-14 bg-white shadow-md flex items-center justify-center">
            <span className="text-black text-3xl sm:text-4xl font-extrabold font-['NanumSquareRound']">
              &lt;
            </span>
          </div>
          <div className="ml-4 text-3xl whitespace-nowrap sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            회원가입
          </div>
        </div>

        {/* 2. 로고 + 행복한 꼬리 */}
        <div className="flex flex-wrap flex-col items-center mb-12">
          <img
            src="/img/logo192.png"
            alt="로고"
            className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
          />
          <div className="text-5xl sm:text-6xl whitespace-nowrap font-bold text-amber-800 font-['Y_Onepick_TTF'] text-center">
            행복한 꼬리
          </div>
        </div>

        {/* 3. 구분선 */}
        <div className="w-full h-0.5 bg-yellow-400 mb-16" />

        {/* 4. 신분증 인증 제목 */}
        <div className="flex justify-center mb-8">
          <div className="text-3xl sm:text-4xl whitespace-nowrap font-normal text-black font-['NanumSquareRound']">
            신분증 인증
          </div>
        </div>

        {/* 5. 파일 업로드 인풋 */}
        <div className="flex flex-col items-center mb-12">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-black border border-gray-300 p-4 rounded-md w-full max-w-[600px] text-center text-lg font-['NanumSquareRound']"
          />
        </div>

        {/* 6. OCR 인증하기 버튼 */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleUpload}
            className="w-full max-w-[600px] h-16 sm:h-20 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-xl sm:text-2xl font-['NanumSquareRound'] transition-all duration-300"
            disabled={loading}
          >
            {loading ? "처리 중..." : "OCR 인증하기"}
          </button>
        </div>
      </div>
    </Suspense>
  );
};

export default Step1;
