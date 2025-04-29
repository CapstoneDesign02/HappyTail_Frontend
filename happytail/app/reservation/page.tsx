"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyReservations,
  getPartnerReservations,
  updateReservationStatus,
  ReservationInfo,
} from "./api/reservationAPI";

export default function ReservationManagePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"my" | "partner">("my");
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);

  useEffect(() => {
    fetchReservations();
  }, [selectedTab]);

  const fetchReservations = async () => {
    try {
      if (selectedTab === "my") {
        const data = await getMyReservations();
        setReservations(data);
      } else {
        const data = await getPartnerReservations();
        setReservations(data);
      }
    } catch (error) {
      console.error("❌ 예약 정보 불러오기 실패:", error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await updateReservationStatus(id, { isAccepted: 1 });
      alert("예약을 수락했습니다.");
      fetchReservations(); // 다시 목록 새로고침
    } catch (error) {
      console.error("❌ 예약 수락 실패:", error);
      alert("예약 수락에 실패했습니다.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateReservationStatus(id, { isAccepted: 2 });
      alert("예약을 거절했습니다.");
      fetchReservations(); // 다시 목록 새로고침
    } catch (error) {
      console.error("❌ 예약 거절 실패:", error);
      alert("예약 거절에 실패했습니다.");
    }
  };

  const handleGoBack = () => router.back();

  return (
    <div className="w-full max-w-[1080px] min-h-screen mx-auto bg-white overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
      {/* 상단 타이틀 */}
      <div className="flex items-center mb-12">
        <button
          onClick={handleGoBack}
          className="size-10 sm:size-12 bg-white flex items-center justify-center mr-4"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            &lt;
          </span>
        </button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black font-['NanumSquareRound']">
          예약 관리
        </h1>
      </div>

      {/* 탭 버튼 + 구분선 */}
      <div className="relative mb-12">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setSelectedTab("my")}
            className={`h-12 sm:h-16 flex items-center justify-center text-lg sm:text-2xl font-extrabold rounded-lg transition-all ${
              selectedTab === "my"
                ? "bg-yellow-400 text-black"
                : "bg-white text-black"
            }`}
          >
            내가 신청한 예약
          </button>
          <button
            onClick={() => setSelectedTab("partner")}
            className={`h-12 sm:h-16 flex items-center justify-center text-lg sm:text-2xl font-extrabold rounded-lg transition-all ${
              selectedTab === "partner"
                ? "bg-yellow-400 text-black"
                : "bg-white text-black"
            }`}
          >
            내가 받은 예약
          </button>
        </div>
        {/* 버튼 아래 고정 구분선 */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
      </div>

      {/* 예약 목록 */}
      {reservations.length === 0 ? (
        <div className="text-center text-lg sm:text-2xl text-gray-500 mt-20">
          예약 내역이 없습니다.
        </div>
      ) : (
        reservations.map((rsv) => (
          <div key={rsv.id} className="relative mb-16">
            {/* 예약 카드 */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {/* 프로필 이미지 */}
              <img
                src={rsv.partnerPhotoUrl}
                alt="프로필"
                className="w-24 h-24 sm:w-40 sm:h-40 rounded-md"
              />

              {/* 예약 정보 */}
              <div className="flex flex-col gap-4 w-full">
                {/* 날짜 시간 */}
                <div className="text-lg sm:text-2xl font-extrabold font-['NanumSquareRound'] text-black">
                  {rsv.startDate} {rsv.startTime} ~ {rsv.endDate} {rsv.endTime}
                </div>

                {/* 상태 표시 */}
                <div className="text-base sm:text-xl font-normal text-black">
                  상태:{" "}
                  {rsv.isAccepted === 0
                    ? "대기 중"
                    : rsv.isAccepted === 1
                    ? "수락됨"
                    : "거절됨"}
                </div>

                {/* 수락/거절 버튼 (파트너 탭에서만, 대기 상태일 때만) */}
                {selectedTab === "partner" && rsv.isAccepted === 0 && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleAccept(rsv.id)}
                      className="flex-1 h-12 sm:h-16 bg-green-400 hover:bg-green-500 text-white font-bold rounded-lg text-lg sm:text-xl transition-all"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleReject(rsv.id)}
                      className="flex-1 h-12 sm:h-16 bg-red-400 hover:bg-red-500 text-white font-bold rounded-lg text-lg sm:text-xl transition-all"
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
