import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CareOptionsProps {
  chatRoomId: number;
  isPartner: boolean;
}

const CareOptions = ({ chatRoomId, isPartner }: CareOptionsProps) => {
  const router = useRouter();

  const options = [
    {
      label: "돌봄 일지",
      icon: "/img/icons/diary2.png",
      route: `/diary`,
    },
    {
      label: "반려동물 프로필",
      icon: "/img/icons/pets2.png",
      route: `/pet-profile/${chatRoomId}`,
    },
    {
      label: "반려동물 피부 상태",
      icon: "/img/icons/health.png",
      route: `/skin-check/${chatRoomId}`,
    },
    {
      label: "홈캠",
      icon: "/img/icons/homecam.png",
      route: `/cctv/${chatRoomId}/${isPartner ? "sender" : "viewer"}`,
    },
  ];

  return (
    <div className="px-1 py-3 bg-white">
      <div className="grid grid-cols-4 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-xl p-1 hover:bg-amber-200 transition-colors h-15"
            onClick={() => router.push(option.route)}
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
    </div>
  );
};

export default CareOptions;
