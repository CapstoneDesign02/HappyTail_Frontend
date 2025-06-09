"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { useState } from "react";

interface SwiperGalleryProps {
  files?: { id: number; url: string; type?: string }[];
  onImageClick: (url: string) => void;
}

export default function SwiperGallery({
  files = [],
  onImageClick,
}: SwiperGalleryProps) {
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"image" | "video" | null>(null);

  const handleClick = (url: string, type: "image" | "video") => {
    setModalUrl(url);
    setModalType(type);
    if (type === "image") {
      onImageClick(url);
    }
  };

  const getFileType = (
    url: string,
    explicitType?: string
  ): "image" | "video" => {
    if (explicitType === "image" || explicitType === "video") return explicitType;
    const ext = url.split(".").pop()?.toLowerCase();
    if (ext && ["mp4", "webm", "mov"].includes(ext)) return "video";
    return "image";
  };

  return (
    <>
      <Swiper spaceBetween={8} slidesPerView={1} className="mb-4 w-full">
        {files.map((file) => {
          const fileType = getFileType(file.url, file.type);
          return (
            <SwiperSlide key={`${file.id}-${file.url}`}>
              {fileType === "image" ? (
                <Image
                  src={file.url}
                  alt="일지 이미지"
                  width={600}
                  height={300}
                  className="w-auto h-[300px] object-contain mx-auto"
                  onClick={() => handleClick(file.url, "image")}
                />
              ) : (
                <video
                  src={file.url}
                  controls
                  className="w-auto h-[300px] object-contain mx-auto"
                  onClick={() => handleClick(file.url, "video")}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 확대 모달 */}
      {modalUrl && modalType === "image" && (
        <div
          onClick={() => setModalUrl(null)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <div className="relative w-[90vw] h-auto max-h-[90vh]">
            <Image
              src={modalUrl}
              alt="확대 이미지"
              width={800}
              height={600}
              className="object-contain w-full max-h-[90vh] rounded mx-auto"
            />
          </div>
        </div>
      )}

      {modalUrl && modalType === "video" && (
        <div
          onClick={() => setModalUrl(null)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center cursor-pointer"
        >
          <div className="relative w-[90vw] h-auto max-h-[90vh]">
            <video
              src={modalUrl}
              controls
              autoPlay
              className="object-contain w-full max-h-[90vh] rounded mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
