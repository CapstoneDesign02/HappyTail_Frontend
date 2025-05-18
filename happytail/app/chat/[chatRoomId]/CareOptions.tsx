import React from "react";
import Image from "next/image";

const CareOptions = () => {
  const options = [
    { label: "돌봄 일지", icon: "/img/icons/diary2.png", route: "" },
    { label: "내 반려동물 프로필", icon: "/img/icons/pets2.png", route: "" },
    { label: "반려동물 피부 상태", icon: "/img/icons/health.png", route: "" },
    { label: "홈캠", icon: "/img/icons/homecam.png", route: "" },
    { label: "사진 공유", icon: "/img/icons/camera.png", route: "" },
  ];

  return (
    <div className="px-1 py-3 bg-white">
      <div className="grid grid-cols-5 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center bg-white rounded-xl p-1 hover:bg-amber-200 transition-colors h-24"
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

            <span className="text-xs text-center break-keep leading-tight">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CareOptions;
