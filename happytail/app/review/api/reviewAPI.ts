import axiosInstance from "@/app/common/axiosInstance";

// 후기 정보 타입
export interface ReviewInfo {
  id: number;
  reservationId: number;
  rating: number;
  content: string;
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

// ✅ 후기 작성/수정
export const submitReview = async (id: number, reviewData: ReviewForm) => {
  try {
    const response = await axiosInstance.post(`/review/${id}`, reviewData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to submit review:", error);
    throw error;
  }
};

// ✅ 후기 삭제
export const deleteReview = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/review/delete/${id}`);
  } catch (error) {
    console.error("❌ Failed to delete review:", error);
    throw error;
  }
};
