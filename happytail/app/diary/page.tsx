"use client";

import React, { useEffect, useState } from "react";
import { DiaryInfo } from "./api/DiaryAPI";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { DropdownFilter } from "./dropdownFilter";
import dynamic from "next/dynamic";
const SwiperGallery = dynamic(() => import("./swiperGallery"), { ssr: false });

const mockWrittenDiaries: DiaryInfo[] = [
  {
    id: 1,
    reservationId: 6,
    userId: 4,
    logContent: "깜장이와 함께한 즐거운 산책 💛",
    createdAt: "2025-05-19T00:44:45",
    files: [
      { id: 1, url: "/img/room01.jpg" },
      { id: 2, url: "/img/room02.jpg" },
    ],
    animalInfo: {
      id: 10,
      name: "깜장이",
      type: 1,
      breed: "샴",
      additionalInfo: "예민함",
      files: [
        { id: 2, url: "/img/poppy.jpg" },
      ],
    },
    reservation: undefined,
    userNickname: "주형",
    userPhotoUrl: "/img/profile.jpeg",
  },
  {
    id: 2,
    reservationId: 7,
    userId: 44,
    logContent: "몽이랑 놀이터에서 신나게 놀았어요 🎾",
    createdAt: "2025-05-19T10:30:00",
    files: [
      { id: 3, url: "/img/room01.jpg" },
      { id: 4, url: "/img/room02.jpg" },
    ],
    animalInfo: {
      id: 11,
      name: "몽이",
      type: 1,
      breed: "페르시안",
      additionalInfo: "활발함",
      files: [
        { id: 4, url: "/img/room02.jpg" }
      ],
    },
    reservation: undefined,
    userNickname: "밤밤",
    userPhotoUrl: "/img/profile.jpeg",
  },
];

const mockReceivedDiaries: DiaryInfo[] = [
  {
    id: 3,
    reservationId: 8,
    userId: 5,
    logContent: "밤비는 정말 얌전하고 착했어요 😊",
    createdAt: "2025-05-18T23:35:09",
    files: [
      { id: 10, url: "/img/room03.jpg" },
      { id: 11, url: "/img/room02.jpg" },
    ],
    animalInfo: {
      id: 12,
      name: "밤비",
      type: 0,
      breed: "푸들",
      additionalInfo: "조용함",
      files: [{ id: 3, url: "/img/profile.jpeg" }],
    },
    userNickname: "크리스탈",
    userPhotoUrl: "/img/profile.jpeg",
  },
  {
    id: 4,
    reservationId: 9,
    userId: 6,
    logContent: "콩이랑 공놀이 하면서 하루가 금방 갔네요 🐾",
    createdAt: "2025-05-18T22:00:00",
    files: [
      { id: 13, url: "/img/poppy.jpg" },
      { id: 12, url: "/img/room03.jpg" },
    ],
    animalInfo: {
      id: 13,
      name: "콩이",
      type: 0,
      breed: "비숑",
      additionalInfo: "장난꾸러기",
      files: [{ id: 4, url: "/img/profile.jpeg" }],
    },
    userNickname: "지후",
    userPhotoUrl: "/img/profile.jpeg",
  },
];

export default function DiaryPage() {
  const [selectedTab, setSelectedTab] = useState<"written" | "received">(
    "written"
  );
  const [diaries, setDiaries] = useState<DiaryInfo[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromEdit = searchParams.get("fromEdit");

  useEffect(() => {
    setSelectedAnimal(null);
    setDiaries(
      selectedTab === "written" ? mockWrittenDiaries : mockReceivedDiaries
    );
  }, [selectedTab]);

  const handleDelete = (id: number) => {
    alert(`일지 ${id} 삭제 (목업)`);
    setDiaries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleGoBack = () => {
    if (
      fromEdit === "true" ||
      sessionStorage.getItem("visitedEditPage") === "true"
    ) {
      sessionStorage.removeItem("visitedEditPage");
      window.history.go(-3);
    } else {
      window.history.go(-1);
    }
  };

  const uniqueAnimals = Array.from(
    new Set(diaries.map((d) => d.animalInfo?.name).filter(Boolean) as string[])
  );

  const filteredDiaries = selectedAnimal
    ? diaries.filter((d) => d.animalInfo?.name === selectedAnimal)
    : diaries;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="w-full max-w-[760px] min-w-[400px] min-h-screen mx-auto bg-white px-4 sm:px-6 lg:px-8 py-4 font-['NanumSquareRound']">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-black">
            &lt;
          </span>
        </button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black">
          돌봄 일지
        </h1>
      </div>

      <div className="relative mb-4">
        <div className="grid grid-cols-2">
          {["written", "received"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as "written" | "received")}
              className={`w-full h-12 sm:h-16 flex items-center justify-center text-sm sm:text-xl font-extrabold rounded-lg ${
                selectedTab === tab ? "bg-yellow-400" : "bg-white"
              }`}
            >
              {tab === "written" ? "내가 작성한 일지" : "받은 일지"}
            </button>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
      </div>

      <DropdownFilter
        animals={uniqueAnimals}
        selected={selectedAnimal}
        onSelect={setSelectedAnimal}
      />

      {filteredDiaries.map((entry) => (
        <div key={entry.id} className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <div className="text-base sm:text-lg font-bold">
              {formatDate(entry.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={entry.userPhotoUrl || "/img/profile.jpeg"}
                alt="유저 이미지"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-800">
                {entry.userNickname || "내 프로필"}
              </span>
            </div>
          </div>

          {entry.files && entry.files.length > 0 && (
            <div className="w-full max-h-[300px] mb-4">
              <SwiperGallery images={entry.files} />
            </div>
          )}

          <div className="flex gap-4 items-start">
            <div className="w-16 aspect-square overflow-hidden rounded-full">
              <Image
                src={entry.animalInfo?.files?.[0]?.url || "/img/profile.jpeg"}
                alt="동물 이미지"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 text-xl text-black whitespace-pre-line">
              {entry.logContent}
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 justify-end mt-4 text-black">
            {selectedTab === "written" && (
              <button
                onClick={() => router.push(`/diary/edit/${entry.id}`)}
                className="h-16 w-32 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg text-base"
              >
                수정
              </button>
            )}
            <button
              onClick={() => handleDelete(entry.id)}
              className="h-16 w-32 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg text-base"
            >
              삭제
            </button>
          </div>
          <div className="w-full h-0.5 bg-yellow-400 my-8" />
        </div>
      ))}
    </div>
  );
}
