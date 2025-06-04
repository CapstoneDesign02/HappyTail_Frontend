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
  try{
  const res = await axiosInstance.get("/careLog/received");
  return res.data || [];
  } catch(e) {
    console.error("❌ 받은 일지 불러오기 실패:", e);
    return[];
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

export const getDiariesByReservation = async (
  reservationId: number
): Promise<DiaryInfo[]> => {
  try {
    const res = await axiosInstance.get(`/careLog/${reservationId}`);
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
  try {
    await axiosInstance.post(`/careLog/${reservationId}`, payload);
  } catch (e) {
    console.error("❌ 일지 작성 실패:", e);
    throw e;
  }
};

export const updateDiary = async (
  diaryId: number,
  payload: { logContent: string; fileIds: number[] }
): Promise<void> => {
  try {
    await axiosInstance.put(`/careLog/${diaryId}`, payload);
  } catch (e) {
    console.error("❌ 일지 수정 실패:", e);
    throw e;
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

