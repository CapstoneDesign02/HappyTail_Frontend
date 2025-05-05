"use client";

import React, { useEffect, useState } from "react";
import { ReviewInfo } from "./api/reviewAPI";
import { useRouter } from "next/navigation";


// 목업 데이터
const writtenMockReviews: ReviewInfo[] = [
  { id: 1, reservationId: 4, rating: 3, content: "직접 작성한 후기입니다." },
  { id: 2, reservationId: 5, rating: 4, content: "내가 쓴 두 번째 후기!" },
];

const receivedMockReviews: ReviewInfo[] = [
  { id: 3, reservationId: 6, rating: 5, content: "받은 후기: 정말 좋았어요!" },
  { id: 4, reservationId: 7, rating: 5, content: "고마워요!" },
];

export default function ReviewManagePage() {
  // 목업 코드
  const [selectedTab, setSelectedTab] = useState<"written" | "received">(
    "written"
  );
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);

  useEffect(() => {
    fetchReviews();
  }, [selectedTab]);

  const fetchReviews = () => {
    if (selectedTab === "written") {
      setReviews(writtenMockReviews);
    } else {
      setReviews(receivedMockReviews);
    }
  };

  const handleDelete = async (id: number) => {
    alert(`리뷰 ${id} 삭제 (목업)`);
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };


  // 실제 api 코드
  //   const [reviews, setReviews] = useState<ReviewInfo[]>([]);
    const router = useRouter();

  //   // 후기 가져오기
  //   useEffect(() => {
  //     fetchReviews();
  //   }, []);

  //   const fetchReviews = async () => {
  //     try {
  //       const data = await getWrittenReviews(); // 내가 작성한 후기 가져오기
  //       setReviews(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const handleDelete = async (id: number) => {
  //     try {
  //       await deleteReview(id);
  //       alert("후기를 삭제했습니다.");
  //       fetchReviews(); // 다시 불러오기
  //     } catch (error) {
  //       console.error(error);
  //       alert("삭제 실패");
  //     }
  //   };


  const handleGoBack = () => {
    router.back(); // 이렇게 호출해야 해
  };

  return (
    <div className="w-full max-w-[1080px] min-h-screen mx-auto bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-['NanumSquareRound']">
          후기 관리
        </h1>
      </div>

      {/* 탭 버튼 + 구분선 */}
      <div className="relative mb-12">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setSelectedTab("written")}
            className={`h-12 sm:h-16 flex items-center justify-center text-lg sm:text-2xl font-extrabold rounded-lg transition-all ${
              selectedTab === "written"
                ? "bg-yellow-400 text-black"
                : "bg-white text-black"
            }`}
          >
            내가 작성한 후기
          </button>
          <button
            onClick={() => setSelectedTab("received")}
            className={`h-12 sm:h-16 flex items-center justify-center text-lg sm:text-2xl font-extrabold rounded-lg transition-all ${
              selectedTab === "received"
                ? "bg-yellow-400 text-black"
                : "bg-white text-black"
            }`}
          >
            받은 후기
          </button>
        </div>

        {/* 버튼 아래 고정 구분선 */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
      </div>

      {/* 후기 목록 */}
      {reviews.map((review) => (
        <div key={review.id} className="relative mb-16">
          {/* 후기 카드 */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* 프로필 이미지 */}
            <img
              src="https://placehold.co/160x160"
              alt="프로필"
              className="w-24 h-24 sm:w-40 sm:h-40 rounded-md"
            />

            {/* 텍스트 블록 */}
            <div className="flex flex-col gap-4 w-full">
              {/* 날짜 (목업 고정) */}
              <div className="text-lg sm:text-2xl font-extrabold font-['NanumSquareRound'] text-black">
                2025 / 02 / 27 목요일 PM 13:12
              </div>

              {/* 별점 */}
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <img
                    key={idx}
                    src="https://placehold.co/30x30"
                    alt="별"
                    className="w-5 h-5 sm:w-7 sm:h-7"
                  />
                ))}
              </div>

              {/* 후기 내용 */}
              <div className="text-base sm:text-xl font-normal text-black break-words">
                {review.content}
              </div>

              {/* 수정 / 삭제 버튼 */}
<div className="flex gap-4 mt-4">
  {selectedTab === "written" && (
    <button
      onClick={() => alert(`수정 페이지 이동 (id: ${review.id})`)}
      className="flex-1 h-12 sm:h-16 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-lg sm:text-xl transition-all"
    >
      수정
    </button>
  )}
  <button
    onClick={() => handleDelete(review.id)}
    className={`${
      selectedTab === "written" ? "flex-1" : "w-full"
    } h-12 sm:h-16 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg text-lg sm:text-xl transition-all`}
  >
    삭제
  </button>
</div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
