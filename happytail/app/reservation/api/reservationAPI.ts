import axiosInstance from "@/app/common/axiosInstance";

// 예약 정보 타입
export interface ReservationInfo {
  id: number;
  partnerPhotoUrl: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isAccepted: number; // 0: 대기, 1: 수락, 2: 거절
}

// ✅ 예약 신청 데이터 타입
export interface ApplyReservationForm {
  animalId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

// ✅ 예약 수락/거절 데이터 타입
export interface UpdateReservationStatusForm {
  isAccepted: number; // 1: 수락, 2: 거절
}

// ✅ 내가 신청한 예약 목록 조회
export const getMyReservations = async (): Promise<ReservationInfo> => {
  return await axiosInstance.get("/reservation");
};

// ✅ 내가 받은 예약 목록 조회 (파트너 입장)
export const getPartnerReservations = async (): Promise<ReservationInfo> => {
  return await axiosInstance.get("/reservation/partner");
};

// ✅ 예약 신청하기
export const applyReservation = async (postId: number, formData: ApplyReservationForm) => {
  try {
    const response = await axiosInstance.post(`/reservation/apply/${postId}`, formData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to apply reservation:", error);
    throw error;
  }
};

// ✅ 예약 수락/거절하기
export const updateReservationStatus = async (reservationId: number, statusData: UpdateReservationStatusForm) => {
  try {
    const response = await axiosInstance.put(`/reservation/${reservationId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update reservation status:", error);
    throw error;
  }
};
