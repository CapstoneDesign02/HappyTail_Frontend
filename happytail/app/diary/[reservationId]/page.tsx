"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getDiariesByReservation, DiaryInfo } from "../api/DiaryAPI";
import Image from "next/image";
import dynamic from "next/dynamic";
const SwiperGallery = dynamic(() => import("../swiperGallery"), { ssr: false });

export default function ReservationDiariesPage() {
  const { reservationId } = useParams();
  const router = useRouter();
  const [diaries, setDiaries] = useState<DiaryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const fromEdit = searchParams.get("fromEdit");

  useEffect(() => {
    const fetchDiaries = async () => {
      if (!reservationId) return;
      try {
        const data = await getDiariesByReservation(Number(reservationId));
        console.log("📒 전체 일지 상세 보기:", JSON.stringify(data, null, 2));

        setDiaries(data);
      } catch (error) {
        console.error("❌ 예약 일지 불러오기 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiaries();
  }, [reservationId]);

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
        <div className="text-2xl sm:text-2xl lg:text-4xl font-extrabold text-black">
          돌봄 일지
        </div>
      </div>

      <div className="w-full h-0.5 bg-yellow-400 mb-16" />

      {loading ? (
        <div className="text-center text-gray-500">불러오는 중...</div>
      ) : diaries.length === 0 ? (
        <div className="text-center text-gray-500">등록된 일지가 없습니다.</div>
      ) : (
        diaries.map((entry) => (
          <div key={entry.id} className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <div className="text-base sm:text-lg font-bold">
                {formatDate(entry.createdAt)}
              </div>
            </div>

            {entry.files && entry.files.length > 0 && (
              <div className="w-full max-h-[300px] mb-4">
                <SwiperGallery
                  images={entry.files}
                  onImageClick={setModalUrl}
                />
              </div>
            )}

            <div className="flex gap-4 items-start mb-2">
              <div className="flex-1 text-xl text-black whitespace-pre-line">
                {entry.logContent}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  router.push(
                    `/diary/edit/${entry.id}`
                  )
                }
                className="h-12 w-28 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg text-sm"
              >
                수정
              </button>
            </div>

            <div className="w-full h-0.5 bg-yellow-400 my-8" />

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
        ))
      )}

      {/* 글쓰기 버튼 */}
      <button
        onClick={() =>
          router.push(`/diary/${reservationId}/post`)
        }
        className="fixed bottom-6 right-6 z-50 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
        aria-label="일지 작성"
      >
        +
      </button>
    </div>
  );
}
