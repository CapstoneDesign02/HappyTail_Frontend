"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { joinAPI } from "../join/joinAPI";
import { getProfile } from "./api/profileAPI";

interface UserProfile {
  nickname: string;
  name: string;
  age: string;
  gender: string;
  ssn: string;
  phone: string;
  address: string;
  email: string;
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSubmitted, setDataSubmitted] = useState<boolean>(false); // API 호출 상태 추적
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      console.log("유저 프로필 데이터:", data);
      return data;
    };
    fetchProfile();
  }),
    [];

  // 백엔드에서 사용자 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user"); // 유저 정보 API
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 사용자 데이터가 로드된 후 한 번만 joinAPI 호출
  useEffect(() => {
    const submitUserData = async () => {
      if (user && !dataSubmitted) {
        try {
          await joinAPI(
            user.email,
            user.name,
            user.address,
            user.gender === "남" ? 1 : 2,
            user.ssn,
            user.phone,
            user.nickname
          );
          console.log("유저 정보 백엔드 전송");
          setDataSubmitted(true); // API 호출 완료 표시
        } catch (error) {
          console.error("Error submitting user data:", error);
        }
      }
    };

    submitUserData();
  }, [user, dataSubmitted]);

  // 로그인 안 되어 있으면 KakaoLogin.tsx로 이동
  // useEffect(() => {
  //     if (!loading && !user) {
  //         router.push('/login/KakaoLogin'); // 로그인 페이지로 이동
  //     }
  // }, [loading, user, router]);

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
            { label: "나이", value: user?.age },
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
