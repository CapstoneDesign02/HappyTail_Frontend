"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import { useState } from "react";

interface SwiperGalleryProps {
  images: { id: number; url: string }[];
}

export default function SwiperGallery({ images }: SwiperGalleryProps) {
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  return (
    <>
      <Swiper spaceBetween={8} slidesPerView={1} className="mb-4 w-full">
        {images.map((file) => (
          <SwiperSlide key={`${file.id}-${file.url}`}>
            <Image
              src={file.url}
              alt="일지 이미지"
              width={600}
              height={300}
              className="w-auto h-[300px] object-contain mx-auto"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 확대모달 */}
      {modalUrl && (
        <div
          onClick={() => setModalUrl(null)}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={modalUrl}
              alt="확대 이미지"
              fill
              className="object-contain rounded"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
