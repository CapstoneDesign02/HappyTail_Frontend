"use client";

import { useState } from "react";
import { checkNicknameAPI, joinAPI } from "./joinAPI";
import { OCRmockdata } from "./mockData";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [file, setFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<{
    name?: string;
    idNumber?: string;
    gender?: string;
    address?: string;
    valid?: boolean;
    reason?: string;
  } | null>(null);
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("이미지를 선택하세요!");
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
        setOcrResult(OCRmockdata); // 실제 OCR 결과로 대체 가능
      } else {
        alert("OCR 실패: " + data.error);
      }
    } catch (error) {
      console.error("OCR 처리 오류:", error);
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  const checkNickname = async () => {
    if (!nickname) return;

    try {
      const data = await checkNicknameAPI(nickname);
      setIsNicknameAvailable(!data.isDuplicate);
      if (data.isDuplicate) alert("이미 사용 중인 닉네임입니다.");
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      alert("서버 오류");
    }
  };

  const handleJoin = async () => {
    if (!phone) return alert("전화번호를 입력하세요.");
    if (!isNicknameAvailable) return alert("닉네임을 확인해주세요.");

    if (OCRmockdata.valid) {
      const phoneSanitized = phone.replace(/-/g, "");
      const data = await joinAPI(
        email,
        OCRmockdata.name || "",
        OCRmockdata.address || "",
        OCRmockdata.gender === "M" ? 1 : 2,
        OCRmockdata.idNumber.replace("-", ""),
        phoneSanitized,
        nickname
      );
      localStorage.setItem("token", data.token);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">행복한 꼬리 회원가입</h1>

      {email && <p className="text-gray-700 mb-4">가입 이메일: {email}</p>}

      {/* OCR 업로드 */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          주민등록증 이미지 업로드
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "처리 중..." : "OCR 인식"}
        </button>
      </div>

      {/* 닉네임 */}
      <div className="mb-6">
        <label htmlFor="nickname" className="block font-medium mb-1">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={checkNickname}
          className="mt-2 bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded"
        >
          닉네임 중복 확인
        </button>
        {!isNicknameAvailable && (
          <p className="text-red-500 mt-2">⚠️ 이미 사용 중인 닉네임입니다.</p>
        )}
      </div>

      {/* 전화번호 */}
      <div className="mb-6">
        <label htmlFor="phone" className="block font-medium mb-1">
          전화번호
        </label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="010-0000-0000"
        />
      </div>

      {/* OCR 결과 */}
      {ocrResult && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">OCR 결과</h2>
          {ocrResult.valid ? (
            <>
              <p>✅ 이름: {ocrResult.name}</p>
              <p>✅ 주민등록번호: {ocrResult.idNumber}</p>
              <p>✅ 성별: {ocrResult.gender}</p>
              <p>✅ 주소: {ocrResult.address}</p>
            </>
          ) : (
            <p className="text-red-500">🚨 위조 의심: {ocrResult.reason}</p>
          )}
        </div>
      )}

      {/* 가입 버튼 */}
      <button
        onClick={handleJoin}
        className="w-full bg-yellow-300 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        가입하기
      </button>
    </div>
  );
}
