"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getWrittenDiaries,
  getReceivedDiaries,
  DiaryInfo,
  deleteDiary,
} from "./api/DiaryAPI";
import Image from "next/image";
import { DropdownFilter } from "./dropdownFilter";
import dynamic from "next/dynamic";
const SwiperGallery = dynamic(() => import("./swiperGallery"), { ssr: false });

// Separate component that uses useSearchParams
function DiaryContent() {
  const [selectedTab, setSelectedTab] = useState<"written" | "received">(
    "written"
  );
  const [diaries, setDiaries] = useState<DiaryInfo[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromEdit = searchParams.get("fromEdit");

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data =
          selectedTab === "written"
            ? await getWrittenDiaries()
            : await getReceivedDiaries();
        setDiaries(data);
      } catch (err) {
        console.error("❌ 일지 로딩 오류:", err);
      }
    };

    fetchDiaries();
  }, [selectedTab]);

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteDiary(id);
      setDiaries((prev) => prev.filter((entry) => entry.id !== id));
      confirm("일지가 삭제되었습니다.");
    } catch (err) {
      console.error("❌ 일지 삭제 오류:", err);
      alert("삭제 실패");
    }
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
    <div className="w-[90%] min-w-[400px] min-h-screen mx-auto bg-white px-4 sm:px-6 lg:px-8 py-4 font-['NanumSquareRound']">
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
            {/* 날짜 */}
            <div className="text-base sm:text-lg font-bold">
              {formatDate(entry.createdAt)}
            </div>

            {/* 닉네임 + 프로필 */}
            <div className="flex items-center gap-2">
              <img
                src={entry.partnerUrl}
                alt="상대방 프로필"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm sm:text-base font-medium">
                {entry.partnerNickname}
              </div>
            </div>
          </div>

          {entry.files && entry.files.length > 0 && (
            <div className="w-full max-h-[300px] mb-4">
              <SwiperGallery files={entry.files} onImageClick={setModalUrl} />
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
                onClick={() =>
                  router.push(
                    `/diary/edit/${entry.id}`
                  )
                }
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
      {modalUrl && (
        <div
          onClick={() => setModalUrl(null)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <div className="max-w-[90vw] max-h-[90vh] overflow-auto">
            <img
              src={modalUrl}
              alt="확대 이미지"
              className="object-contain max-w-full max-h-[90vh] rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Loading component for Suspense fallback
function DiaryLoading() {
  return (
    <div className="w-[90%] min-w-[400px] min-h-screen mx-auto bg-white px-4 sm:px-6 lg:px-8 py-4 font-['NanumSquareRound']">
      <div className="flex items-center mb-4">
        <div className="size-10 sm:size-12 bg-gray-200 animate-pulse mr-4 rounded"></div>
        <div className="h-8 bg-gray-200 animate-pulse rounded w-32"></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-12 sm:h-16 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-12 sm:h-16 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function DiaryPage() {
  return (
    <Suspense fallback={<DiaryLoading />}>
      <DiaryContent />
    </Suspense>
  );
}
