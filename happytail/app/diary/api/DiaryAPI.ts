import axiosInstance from "@/app/common/axiosInstance";
import { File } from "@/app/common/fileType";

export interface DiaryInfo {
  userNickname: string;
  userPhotoUrl: string;
  id: number;
  reservationId: number;
  userId: number;
  logContent: string;
  createdAt: string;
  files: File[];

  partnerNickname?: string;
  partnerUrl?: string;

  animalInfo?: {
    id: number;
    name: string;
    type: number;
    breed: string;
    additionalInfo: string;
    files: File[];
  };

  reservation?: {
    id: number;
    partnerId: number;
    userId: number;
    animalId: number;
    startDate: string;
    endDate: string;
    isAccepted: number;
  };
}


// ✅ 내가 받은 일지
export const getReceivedDiaries = async (): Promise<DiaryInfo[]> => {
  try {
    const res = await axiosInstance.get("/careLog/received");
    return res.data || [];
  } catch (e) {
    console.error("❌ 받은 일지 불러오기 실패:", e);
    return [];
  }
};

export const getWrittenDiaries = async (): Promise<DiaryInfo[]> => {
  try {
    const res = await axiosInstance.get("/careLog/written");
    return res.data || [];
  } catch (e) {
    console.error("❌ 작성한 일지 불러오기 실패:", e);
    return [];
  }
};

export const getDiaryById = async (diaryId: number): Promise<DiaryInfo | null> => {
  try {
    const res = await axiosInstance.get(`/careLog/detail/${diaryId}`);
    return res.data || null;
  } catch (e) {
    console.error("❌ 일지 단건 조회 실패:", e);
    return null;
  }
};


export const getDiariesByReservation = async (
  reservationId: number
): Promise<DiaryInfo[]> => {
  try {
    console.log("📡 getDiariesByReservation 호출:", reservationId); // ✅ 추가
    const res = await axiosInstance.get(`/careLog/${reservationId}`);
    console.log("📥 받은 응답:", res.data); // ✅ 추가
    return res.data || [];
  } catch (e) {
    console.error("❌ 예약별 일지 조회 실패:", e);
    return [];
  }
};


export const writeDiary = async (
  reservationId: number,
  payload: { logContent: string; fileIds: number[] }
): Promise<void> => {
  console.log("📡 writeDiary 호출:", reservationId, payload);

  try {
    const res = await axiosInstance.post(`/careLog/${reservationId}`, payload);
    console.log("✅ 응답:", res);
  } catch (e) {
    console.error("❌ writeDiary 오류:", e);
    throw e;
  }
};

//일지 수정 API
export const updateDiary = async (
  careLogId: number,
  formData: { logContent: string; fileIds: number[] }
) => {
  try {
    const response = await axiosInstance.put(`/careLog/${careLogId}`, formData);
    return response.data;
  } catch (error) {
    console.error("❌ 일지 수정 실패:", error);
    throw error;
  }
};

export const deleteDiary = async (diaryId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/careLog/${diaryId}`);
  } catch (e) {
    console.error("❌ 일지 삭제 실패:", e);
    throw e;
  }
};
