"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimalProfile } from "../type/ChatType";

interface CareOptionsProps {
  chatRoomId: number;
  isPartner: boolean;
  animalProfile: AnimalProfile;
}

const CareOptions = ({
  chatRoomId,
  isPartner,
  animalProfile,
}: CareOptionsProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    {
      label: "돌봄 일지",
      icon: "/img/icons/diary2.png",
      onClick: () => router.push(`/diary/${chatRoomId}`),
    },
    {
      label: "반려동물 프로필",
      icon: "/img/icons/pets2.png",
      onClick: () => setIsModalOpen(true), // 모달 오픈
    },
    {
      label: "반려동물 피부 상태",
      icon: "/img/icons/health.png",
      onClick: () => router.push(`/ai/list/${chatRoomId}`),
    },
    {
      label: "홈캠",
      icon: "/img/icons/homecam.png",
      onClick: () =>
        router.push(`/cctv/${chatRoomId}/${isPartner ? "sender" : "viewer"}`),
    },
  ];

  const petTypeName = (type: number) => {
    switch (type) {
      case 0:
        return "강아지";
      case 1:
        return "고양이";
      default:
        return "기타";
    }
  };

  return (
    <div className="px-1 py-3 bg-white relative">
      <div className="grid grid-cols-4 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-xl p-1 hover:bg-amber-200 transition-colors h-15"
            onClick={option.onClick}
          >
            <div className="mb-2">
              <Image
                src={option.icon}
                alt={option.label}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-md text-center break-keep leading-tight">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* 반려동물 프로필 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              반려동물 프로필
            </h2>
            <div className="space-y-2">
              <div>
                <strong>이름:</strong> {animalProfile.name}
              </div>
              <div>
                <strong>종류:</strong> {petTypeName(animalProfile.type)}
              </div>
              <div>
                <strong>품종:</strong> {animalProfile.breed}
              </div>
              <div>
                <strong>추가 정보:</strong>{" "}
                {animalProfile.additionalInfo || "없음"}
              </div>
              {animalProfile.files && animalProfile.files.length > 0 && (
                <div>
                  <strong>사진:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Image
                      alt="반려동물 사진"
                      src={animalProfile.files[0].url}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareOptions;
