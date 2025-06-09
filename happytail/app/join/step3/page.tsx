"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkNicknameAPI, joinAPI } from "../joinAPI";
import { OCRData } from "../mockData";

export default function Step3() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
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

  const checkNickname = async () => {
    const res = await checkNicknameAPI(nickname);
    setIsDuplicate(res.isDuplicate);
    if (res.isDuplicate) alert("이미 사용 중인 닉네임입니다.");
  };

  const handleJoin = async () => {
    if (!phone || !nickname || !ocrData)
      return alert("필수 정보를 입력하세요.");
    if (isDuplicate) return alert("닉네임 중복 확인하세요.");

    const phoneSanitized = phone.replace(/-/g, "");
    const gender = ocrData.gender === "남성" ? 1 : 2;

    const data = await joinAPI(
      email,
      ocrData.name,
      ocrData.address,
      gender,
      ocrData.idNumber.replace("-", ""),
      phoneSanitized,
      nickname
    );

    localStorage.removeItem("ocrResult");
    localStorage.setItem("token", data.token);
    router.push("/join/step4");
  };

  if (!ocrData) return null;

  return (
    <div className="w-full min-w-[450px] min-h-screen bg-white mx-auto overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* 상단 타이틀 */}
      <div className="flex items-center mb-12">
        <button
          onClick={() => router.back()}
          className="size-12 sm:size-14 bg-white shadow-md flex items-center justify-center"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            &lt;
          </span>
        </button>
        <div className="ml-4 whitespace-nowrap text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
          회원가입
        </div>
      </div>

      {/* 로고 + 문구 */}
      <div className="flex flex-col items-center mb-12">
        <img
          src="/img/logo192.png"
          alt="로고"
          className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
        />
        <div className="text-4xl whitespace-nowrap sm:text-6xl font-bold text-amber-800 font-['Y_Onepick_TTF'] text-center">
          행복한 꼬리
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full h-0.5 bg-yellow-400 mb-16" />

      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-2xl flex flex-col space-y-8">
          {/* 전화번호 입력 */}
          <div className="flex text-black flex-col">
            <label className="text-black text-2xl font-['NanumSquareRound'] mb-2">
              전화번호
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full p-4 border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* 닉네임 입력 */}
          <div className="flex text-black flex-col">
            <label className="text-black text-2xl font-['NanumSquareRound'] mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsDuplicate(true);
              }}
              placeholder="사용할 닉네임을 입력하세요"
              className="w-full p-4 border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={checkNickname}
              className="mt-4 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-xl py-3 transition-all duration-300"
            >
              닉네임 중복 확인
            </button>
            {isDuplicate && (
              <p className="text-red-500 text-lg mt-2 font-['NanumSquareRound']">
                🚨 닉네임 중복 확인이 필요합니다.
              </p>
            )}
            {isDuplicate === false && (
              <p className="text-green-500 text-lg mt-2 font-['NanumSquareRound']">
                ✅ 사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/* OCR 결과 출력 */}
          <div className="text-2xl sm:text-2xl text-black flex flex-col gap-8 w-full max-w-2xl">
            <p>
              <strong>이름:</strong> {ocrData.name}
            </p>
            <p>
              <strong>성별:</strong> {ocrData.gender === "M" ? "남" : "여"}
            </p>
            <p>
              <strong>주민등록번호:</strong> {ocrData.idNumber}
            </p>
            <p>
              <strong>주소:</strong> {ocrData.address}
            </p>
            <p>
              <strong>이메일:</strong> {email || "example@domain.com"}
            </p>
          </div>

          {/* 가입하기 버튼 */}
          <button
            onClick={handleJoin}
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-xl sm:text-2xl py-4 transition-all duration-300"
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}
