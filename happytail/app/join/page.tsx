"use client";

import { useState, Suspense } from "react";
import { checkNicknameAPI, joinAPI } from "./joinAPI";
import { OCRmockdata } from "./mockData";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinPageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <JoinPage />
    </Suspense>
  );
}

function JoinPage() {
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
  const [phone, setPhone] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean>(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const checkNicknameAvailability = async () => {
    if (!nickname) return;

    try {
      const data = await checkNicknameAPI(nickname);
      setIsNicknameAvailable(!data.isDuplicate);

      if (data.isDuplicate) {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 확인 오류:", error);
      alert("서버 오류");
    }
  };

  const handleJoin = async () => {
    if (!phone) return alert("핸드폰 번호를 입력하세요!");
    if (!isNicknameAvailable) return alert("닉네임을 다시 확인해주세요.");

    if (OCRmockdata.valid) {
      const phoneRegex = phone.replace(/-/g, "");

      const data = await joinAPI(
        email,
        OCRmockdata.name || "",
        OCRmockdata.address || "",
        OCRmockdata.gender === "M" ? 1 : 2,
        OCRmockdata.idNumber.replace("-", ""),
        phoneRegex,
        nickname
      );

      localStorage.setItem("token", data.token);
      router.push("/");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("이미지를 선택하세요!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setOcrResult(OCRmockdata);
      } else {
        alert("OCR 인식 실패: " + data.error);
      }
    } catch (error) {
      console.error("OCR 요청 오류:", error);
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">행복한 꼬리 회원가입</h1>
      {email && <p className="mt-2">가입 이메일: {email}</p>}

      <div className="mt-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="mt-2 bg-green-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "처리 중..." : "주민등록증 OCR 인식"}
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="nickname" className="block">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={handleNicknameChange}
          className="mt-1 p-2 border rounded"
          placeholder="닉네임 입력"
        />
        <button
          onClick={checkNicknameAvailability}
          className="mt-2 bg-yellow-500 text-white p-2 rounded"
        >
          닉네임 중복 확인
        </button>
        {!isNicknameAvailable && (
          <p className="text-red-500 mt-2">⚠️ 이미 사용 중인 닉네임입니다.</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="phone" className="block">
          전화번호
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          className="mt-1 p-2 border rounded"
          placeholder="전화번호 입력"
        />
      </div>

      {ocrResult && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold">OCR 결과</h2>
          {ocrResult.valid ? (
            <>
              <p>🔍 이름: {ocrResult.name}</p>
              <p>🔍 주민등록번호: {ocrResult.idNumber}</p>
              <p>🔍 성별: {ocrResult.gender}</p>
              <p>🔍 주소: {ocrResult.address}</p>
            </>
          ) : (
            <p className="text-red-500">🚨 위조 가능성: {ocrResult.reason}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white p-2 rounded"
        onClick={handleJoin}
      >
        가입하기
      </button>
    </div>
  );
}
