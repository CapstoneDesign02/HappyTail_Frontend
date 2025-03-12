"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { KakaoLogin } from "./login/KakaoLogin";

export default function AppBar() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    localStorage.removeItem("accessToken");
    const profile = localStorage.getItem("profileImage");
    if (token) {
      setAccessToken(token);
      setProfileImage(profile);
    }
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-900">
      {/* 왼쪽: 로고 */}
      <h1 className="text-xl font-bold text-[#ffb031] dark:text-white">
        happytail
      </h1>

      {/* 오른쪽: 로그인 버튼 또는 프로필 이미지 */}
      <div>
        {accessToken ? (
          <Image
            src={profileImage || "/profile.jpeg"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
          />
        ) : (
          <KakaoLogin />
        )}
      </div>
    </nav>
  );
}
