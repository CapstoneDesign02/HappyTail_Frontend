"use client";

import React, { useEffect, useState } from "react";
import {
  getWrittenReviews,
  getReceivedReviews,
  deleteReview,
  ReviewInfo,
} from "./api/reviewAPI";
import { useRouter } from "next/navigation";
import Image from "next/image";

const navItems = [
  { icon: "/img/icons/reservation.png", route: "/reservation" },
  { icon: "/img/icons/pets.png", route: "/pets" },
  { icon: "/img/icons/home.png", route: "/post" },
  { icon: "/img/icons/diary.png", route: "/diary" },
  { icon: "/img/icons/profile.png", route: "/profile" },
];

export default function ReviewManagePage() {
  const [selectedTab, setSelectedTab] = useState<"written" | "received">(
    "written"
  );
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      const data =
        selectedTab === "written"
          ? await getWrittenReviews()
          : await getReceivedReviews();

      setReviews(data);
    };
    fetchReviews();
  }, [selectedTab]);

 const handleDelete = async (id: number) => {
  const targetReview = reviews.find((r) => r.id === id);
  console.log("리뷰 작성자:", targetReview?.nickname);

  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    await deleteReview(id);
    alert("삭제되었습니다.");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  } catch (error) {
    console.error("❌ 리뷰 삭제 실패:", error);
    alert("리뷰 삭제에 실패했습니다.");
  }
};



  const handleGoMain = () => router.push(`/post`);

  return (
    <div className="w-[90%] w-min-[400px] min-h-screen mx-auto bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-4 font-['NanumSquareRound']">
      {/* 상단 타이틀 */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoMain}
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
            <div className="w-24 sm:w-40 aspect-square overflow-hidden rounded-full shrink-0">
              <Image
                src={review.profileImage || "/img/profile.jpeg"}
                alt="프로필"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>

            {/* 오른쪽 텍스트 내용 */}
            <div className="flex flex-col gap-2 flex-1">
              {/* 닉네임 */}
              <div className="text-base sm:text-lg font-bold">
                {review.nickname}
              </div>

              {/* 별점 */}
              <div className="text-yellow-400 text-lg sm:text-xl">
                {"★".repeat(review.rating)}
              </div>

              {/* 후기 내용 */}
              <div className="text-xl sm:text-xl text-black break-words">
                {review.content}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end mt-4 sm:mt-4 text-black">
            {selectedTab === "written" && (
              <button
                onClick={() =>
                  router.push(
                    `/review/form/${review.reservationId}`
                  )
                }
                className="h-14 w-full sm:h-16 sm:w-32 bg-amber-400 hover:bg-amber-500  font-bold rounded-lg text-base sm:text-lg"
              >
                수정
              </button>
            )}
            <button
              onClick={() => handleDelete(review.id)}
              className={`$${
                selectedTab === "written" ? "flex-2" : "w-full"
              } h-14 w-full sm:h-16 sm:w-32 bg-amber-400 hover:bg-amber-500  font-bold rounded-lg text-base sm:text-lg`}
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      {/* 하단 네비게이션 */}
      <footer className="w-full w-min-[400px] h-20 bg-amber-100 flex justify-around items-center fixed bottom-0 left-0 right-0 mx-auto">
        {navItems.map(({ icon, route }, i) => (
          <button
            key={i}
            onClick={() => router.push(route)}
            className="w-14 h-14 flex items-center justify-center"
          >
            <Image src={icon} alt="nav-icon" width={60} height={60} />
          </button>
        ))}
      </footer>
    </div>
  );
}
