"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function DiaryPage() {
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromEdit = searchParams.get("fromEdit");

  const handleGoBack = () => router.back();

  return (
    <div className="w-full min-w-[400px] min-h-screen mx-auto bg-white px-4 sm:px-6 lg:px-8 py-4 font-['NanumSquareRound']">
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
          반려동물 상태 기록
        </h1>
      </div>


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
              <Image src={entry.files} onImageClick={setModalUrl} />
            </div>
          )}

          <div className="flex gap-4 items-start">
            <div className="w-16 aspect-square overflow-hidden rounded-full">
              <Image
                src={entry.animalInfo?.files?.url || null}
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
