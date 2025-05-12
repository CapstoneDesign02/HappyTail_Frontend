"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getMyReservations,
  getPartnerReservations,
  ReservationInfo,
} from "./api/reservationAPI";

const mockMyReservations = [
  {
    id: 1,
    profilePhotoUrl: "/img/profile/winter.jpg",
    startDate: "2025-05-13",
    endDate: "2025-05-13",
    startTime: "10:00",
    endTime: "12:00",
    isAccepted: 1, // 신청 완료
  },
  {
    id: 2,
    profilePhotoUrl: "/img/profile/iu.png",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    startTime: "14:00",
    endTime: "16:00",
    isAccepted: 2, // 거절됨
  },
];

const mockPartnerReservations = [
  {
    id: 3,
    profilePhotoUrl: "/img/profile/cha.jpg",
    startDate: "2025-05-16",
    endDate: "2025-05-16",
    startTime: "09:00",
    endTime: "11:00",
    isAccepted: 0, // 대기중
  },
  {
    id: 4,
    profilePhotoUrl: "/img/profile/jang.jpg",
    startDate: "2025-05-17",
    endDate: "2025-05-17",
    startTime: "13:00",
    endTime: "15:00",
    isAccepted: 1, // 신청 완료
  },
];

// 상태 업데이트용 목 함수
const updateReservationStatus = async (
  id: number,
  update: { isAccepted: number }
) => {
  alert(
    `예약 ${id} 상태를 ${
      update.isAccepted === 1 ? "수락" : "거절"
    } 처리했습니다. (목데이터)`
  );
};

export default function ReservationManagePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"my" | "partner">("my");
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navItems = [
    { icon: "/img/icons/reservation.png", route: "/reservation" },
    { icon: "/img/icons/pets.png", route: "/pets" },
    { icon: "/img/icons/home.png", route: "/post" },
    { icon: "/img/icons/diary.png", route: "/diary" },
    { icon: "/img/icons/profile.png", route: "/profile" },
  ];

  useEffect(() => {
    fetchReservations();
  }, [selectedTab]);

  // 목데이터
  // const fetchReservations = async () => {
  //   try {
  //     if (selectedTab === "my") {
  //       setReservations(mockMyReservations);
  //     } else {
  //       setReservations(mockPartnerReservations);
  //     }
  //   } catch (error) {
  //     console.error("❌ 예약 정보 불러오기 실패:", error);
  //   }
  // };

    const fetchReservations = async () => {
    try {
      setIsLoading(true);
      setReservations([]);
      const data =
        selectedTab === "my"
          ? await getMyReservations()
          : await getPartnerReservations();
      setReservations(data);
    } catch (error) {
      console.error("❌ 예약 정보 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAccept = async (id: number) => {
    try {
      await updateReservationStatus(id, { isAccepted: 1 });
      alert("예약을 수락했습니다.");
      fetchReservations();
    } catch (error) {
      console.error("❌ 예약 수락 실패:", error);
      alert("예약 수락에 실패했습니다.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateReservationStatus(id, { isAccepted: 2 });
      alert("예약을 거절했습니다.");
      fetchReservations();
    } catch (error) {
      console.error("❌ 예약 거절 실패:", error);
      alert("예약 거절에 실패했습니다.");
    }
  };

  const handleGoBack = () => router.back();

  return (
    <div className="max-w-screen-sm mx-auto">
      <div className="w-full max-w-xl py-3">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
              &lt;
            </span>
          </button>
          <h1 className="whitespace-nowrap text-2xl font-extrabold text-black">
            예약 관리
          </h1>
        </div>
      </div>

      {/* 탭 버튼 */}
      <div className="relative mb-4">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setSelectedTab("my")}
            className={`w-full text-ellipsis overflow-hidden whitespace-nowrap h-12 sm:h-16 flex items-center justify-center text-sm sm:text-xl font-extrabold rounded-lg ${
              selectedTab === "my"
                ? "bg-yellow-400 text-black"
                : "bg-white text-black"
            }`}
          >
            내가 신청한 예약
          </button>
          <button
            onClick={() => setSelectedTab("partner")}
            className={`w-full text-ellipsis overflow-hidden whitespace-nowrap h-12 sm:h-16 flex items-center justify-center text-sm sm:text-xl font-extrabold rounded-lg ${
              selectedTab === "partner"
                ? "bg-yellow-400 text-black"
                : "bg-white text-black"
            }`}
          >
            내가 받은 예약
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="text-center text-xl sm:text-2xl text-stone-400 mt-20 animate-pulse">
          예약 정보를 불러오는 중입니다...
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center text-xl sm:text-2xl text-stone-500 mt-20">
          예약 내역이 없습니다.
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {" "}
          {/* 스크롤 가능 영역 추가 */}
          {reservations
            .slice()
            .map((reservation) => {
              const statusText =
                reservation.isAccepted === 0
                  ? "대기중"
                  : reservation.isAccepted === 1
                  ? "돌봄 예정"
                  : reservation.isAccepted === 2
                  ? "거절됨"
                  : reservation.isAccepted === 3
                  ? "돌봄 중"
                  : "돌봄 완료";

              const statusColor =
                reservation.isAccepted === 0
                  ? "text-gray-700"
                  : reservation.isAccepted === 1
                  ? "text-green-400"
                  : reservation.isAccepted === 2
                  ? "text-red-400"
                  : reservation.isAccepted === 3
                  ? "text-amber-400"
                  : "text-gray-700";

              return (
                <div
                  key={reservation.id}
                  className="relative mb-8 border-b border-yellow-300 pb-4 pl-5"
                >
                  <div className="flex flex-col text-sm justify-center sm:flex-row sm:text-xl sm:justify-between items-center mb-2">
                    <div
                      className={`text-base sm:text-2xl font-extrabold ${statusColor}`}
                    >
                      {statusText}
                    </div>
                    <div className="text-base sm:text-2xl font-extrabold text-black font-['NanumSquareRound'] text-right">
                      {reservation.startDate} ~ {reservation.endDate}
                    </div>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row items-center gap-6">
                    {/* 프로필 이미지 */}
                    <div
                      className="flex flex-col aspect-square items-center w-24 rounded-full sm:w-40 shrink-0 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/profile/${
                            selectedTab === "my"
                              ? reservation.partnerId
                              : reservation.userId
                          }`
                        )
                      }
                    >
                      <Image
                        src={reservation.profilePhotoUrl || "/img/profile.jpeg"}
                        alt="프로필"
                        className="w-24 h-24 rounded-full object-cover"
                        width={96}
                        height={96}
                        priority
                      />

                      <span className="mt-2 text-xl text-center font-extrabold text-gray-800 font-['NanumSquareRound']">
                        {selectedTab === "my"
                          ? reservation.partnerNickname
                          : reservation.userNickname}
                      </span>
                    </div>

                    {/* 예약 정보 및 버튼 */}
                    <div className="flex flex-col justify-between w-full whitespace-nowrap">
                      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end mt-4 sm:mt-4 text-black">
                        {reservation.isAccepted === 0 &&
                        selectedTab === "partner" ? (
                          <>
                            <button
                              onClick={() => handleAccept(reservation.id)}
                              className="h-14 w-full bg-green-400 hover:bg-green-500 font-bold rounded-lg text-base sm:text-lg"
                            >
                              수락
                            </button>
                            <button
                              onClick={() => handleReject(reservation.id)}
                              className="h-14 w-full  bg-red-400 hover:bg-red-500 font-bold rounded-lg text-base sm:text-lg"
                            >
                              거절
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/chat/${reservation.id}`)
                              }
                              className="h-14 w-full  bg-blue-400 hover:bg-blue-500 font-bold rounded-lg text-base sm:text-lg"
                            >
                              채팅
                            </button>
                          </>
                        ) : reservation.isAccepted === 1 ||
                          reservation.isAccepted === 4 ? (
                          <button
                            onClick={() =>
                              router.push(`/chat/${reservation.id}`)
                            }
                            className="h-14 w-full sm:h-16 sm:w-32 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg text-base sm:text-lg"
                          >
                            채팅
                          </button>
                        ) : (
                          reservation.isAccepted === 3 && (
                            <button
                              onClick={() =>
                                router.push(`/chat/${reservation.id}`)
                              }
                              className="h-14 w-full sm:h-16 sm:w-32 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg text-base sm:text-lg"
                            >
                              채팅
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 하단 네비게이션 */}
      <footer className="w-full h-20 bg-amber-100 flex justify-around items-center fixed bottom-0 left-0 right-0 mx-auto max-w-screen-sm">
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
