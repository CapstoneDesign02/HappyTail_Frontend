"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getProfile } from "./api/profileAPI";

interface UserProfile {
  id: number;
  nickname: string;
  name: string;
  points: number;
  gender: number; // 1: 남성, 2: 여성
  ssn: string;
  phone: string;
  address: string;
  email: string;
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      if (data) {
        setUser(data);
        setLoading(false);
      } else {
        console.error("유저 프로필 데이터가 없습니다.");
        setUser(null);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-xl text-gray-500">
        로딩 중...
      </div>
    );
  }

  // 뒤로가기 기능 추가
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white text-black">
      <div className="w-full max-w-xl px-6 pb-8">
        <div className="w-full flex items-center justify-between py-6">
          <div className="flex items-center">
            <button onClick={handleGoBack}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold font-['NanumSquareRound']">
                  {"<"}
                </span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold font-['NanumSquareRound']">
              개인 정보 관리
            </h1>
          </div>
          <button>
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <Image
                src="/img/settings.png"
                alt="User profile"
                width={60}
                height={60}
              />
            </div>
          </button>
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        <div className="w-full space-y-6">
          {[
            { label: "닉네임", value: user?.nickname },
            { label: "이름", value: user?.name },
            { label: "성별", value: user?.gender },
            { label: "휴대폰 번호", value: user?.phone },
            { label: "주소", value: user?.address },
            { label: "카카오 계정", value: user?.email },
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-xl font-normal font-['NanumSquareRound']">
                {item.label}
              </div>
              <div className="text-xl font-normal font-['NanumSquareRound']">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>
      </div>
    </div>
  );
};

export default UserProfilePage;
