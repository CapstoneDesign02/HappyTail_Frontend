"use client";

import React, { useEffect, useState } from "react";
import { ReviewInfo } from "./api/reviewAPI";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 목업 데이터
const writtenMockReviews: ReviewInfo[] = [
  {
    id: 1,
    reservationId: 4,
    rating: 3,
    content: "직접 작성한 후기입니다.",
    profileImage: "https://placehold.co/100x100?text=PartnerA",
  },
  {
    id: 2,
    reservationId: 5,
    rating: 4,
    content: "내가 쓴 두 번째 후기!",
    profileImage: "https://placehold.co/100x100?text=PartnerB",
  },
];

const receivedMockReviews: ReviewInfo[] = [
  {
    id: 3,
    reservationId: 6,
    rating: 5,
    content: "받은 후기: 정말 좋았어요!",
    profileImage: "https://placehold.co/100x100?text=WriterA",
  },
  {
    id: 4,
    reservationId: 7,
    rating: 5,
    content: "고마워요!",
    profileImage: "https://placehold.co/100x100?text=WriterB",
  },
];

export default function ReviewManagePage() {
  const [selectedTab, setSelectedTab] = useState<"written" | "received">(
    "written"
  );
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [selectedTab]);

  const fetchReviews = () => {
    setReviews(
      selectedTab === "written" ? writtenMockReviews : receivedMockReviews
    );
  };

  const handleDelete = (id: number) => {
    alert(`리뷰 ${id} 삭제 (목업)`);
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  const handleGoBack = () => router.back();

  return (
    <div className="w-full max-w-[760px] min-w-[400px] min-h-screen mx-auto bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-4 font-['NanumSquareRound']">
      {/* 상단 타이틀 */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            &lt;
          </span>
        </button>
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black">
          후기 관리
        </h1>
      </div>

      {/* 탭 버튼 */}
      <div className="relative mb-4">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setSelectedTab("written")}
            className={`w-full text-ellipsis overflow-hidden whitespace-nowrap h-12 sm:h-16 flex items-center justify-center text-sm sm:text-xl font-extrabold rounded-lg ${
              selectedTab === "written" ? "bg-yellow-400" : "bg-white"
            }`}
          >
            내가 작성한 후기
          </button>
          <button
            onClick={() => setSelectedTab("received")}
            className={`w-full text-ellipsis overflow-hidden whitespace-nowrap h-12 sm:h-16 flex items-center justify-center text-sm sm:text-xl font-extrabold rounded-lg ${
              selectedTab === "received" ? "bg-yellow-400" : "bg-white"
            }`}
          >
            받은 후기
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
      </div>

      {/* 후기 목록 */}
      {reviews.map((review) => (
        <div key={review.id} className="relative mb-12">
          {/* 날짜 */}
          <div className="text-base sm:text-lg font-bold mb-3">
            2025 / 02 / 27 목요일 PM 13:12
          </div>

          {/* 프로필 + 별점 + 후기내용 */}
          <div className="flex gap-4 items-start">
            {/* 프로필 이미지 */}
            <Image
              src={review.profileImage}
              alt="프로필"
              className="w-24 h-24 rounded-full object-cover"
            />

            {/* 오른쪽 텍스트 내용 */}
            <div className="flex flex-col gap-2 flex-1">
              {/* 별점 (유니코드) */}
              <div className="text-yellow-400 text-lg sm:text-xl">
                {"★".repeat(review.rating)}
              </div>

              {/* 후기 내용 */}
              <div className="text-sm sm:text-base text-black break-words">
                {review.content}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end mt-4 sm:mt-4 text-black">
            {selectedTab === "written" && (
              <button
                onClick={() => alert(`수정 페이지 이동 (id: ${review.id})`)}
                className="h-14 w-full sm:h-16 sm:w-32 bg-amber-400 hover:bg-amber-500  font-bold rounded-lg text-base sm:text-lg"
              >
                수정
              </button>
            )}
            <button
              onClick={() => handleDelete(review.id)}
              className={`${
                selectedTab === "written" ? "flex-2" : "w-full"
              } h-14 w-full sm:h-16 sm:w-32 bg-amber-400 hover:bg-amber-500  font-bold rounded-lg text-base sm:text-lg`}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
