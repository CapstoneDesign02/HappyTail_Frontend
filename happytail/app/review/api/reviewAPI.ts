import axiosInstance from "@/app/common/axiosInstance";

// 후기 정보 타입
export interface ReviewInfo {
  id: number;
  reservationId: number;
  rating: number;
  content: string;
  userFileUrl:string;
  nickname: string;
  yourUserFileUrl: string;
  yourNickname: string;
}


// 후기 작성/수정 시 사용할 데이터 타입
export interface ReviewForm {
  rating: number;
  content: string;
}

// ✅ 내가 작성한 후기 조회
export const getWrittenReviews = async (): Promise<ReviewInfo[]> => {
  try {
    const response = await axiosInstance.get("/review/written");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch written reviews:", error);
    throw error;
  }
};

// ✅ 내가 받은 후기 조회
export const getReceivedReviews = async (): Promise<ReviewInfo[]> => {
  try {
    const response = await axiosInstance.get("/review/received");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch received reviews:", error);
    throw error;
  }
};

// 후기 작성 (예약 ID 기준)
export const createReview = async (reservationId: number, data: ReviewForm) => {
  try {
    const response = await axiosInstance.post(`/review/byReservation/${reservationId}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create review:", error);
    throw error;
  }
};

// 후기 수정 (리뷰 ID 기준)
export const updateReview = async (id: number, data: ReviewForm) => {
  try {
    const response = await axiosInstance.post(`/review/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update review:", error);
    throw error;
  }
};

// ✅ 후기 삭제
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/review/delete/${reviewId}`);
  } catch (error) {
    console.error("❌ Failed to delete review:", error);
    throw error;
  }
};

// ✅ 후기 단건 조회
export const getReviewById = async (id: number): Promise<ReviewInfo> => {
  try {
    const response = await axiosInstance.get(`/review/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch review by id:", error);
    throw error;
  }
};
