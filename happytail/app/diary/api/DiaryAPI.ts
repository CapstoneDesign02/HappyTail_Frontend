import axiosInstance from "@/app/common/axiosInstance";
import { File } from "@/app/common/fileType";

export interface DiaryInfo {
  userNickname: boolean;
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
  const res = await axiosInstance.get("/careLog/received");
  return res.data;
};


// ✅ 내가 쓴 일지
export const getWrittenDiaries = async (): Promise<DiaryInfo[]> => {
  const res = await axiosInstance.get("/careLog/written");
  return res.data;
};

// ✅ 특정 예약의 일지 전체 조회 (채팅창 등)
export const getDiariesByReservation = async (
  reservationId: number
): Promise<DiaryInfo[]> => {
  const res = await axiosInstance.get(`/careLog/${reservationId}`);
  return res.data;
};

// ✅ 일지 작성
export const writeDiary = async (
  reservationId: number,
  payload: { logContent: string; fileIds: number[] }
): Promise<void> => {
  await axiosInstance.post(`/careLog/${reservationId}`, payload);
};

// ✅ 일지 수정
export const updateDiary = async (
  diaryId: number,
  payload: { logContent: string; fileIds: number[] }
): Promise<void> => {
  await axiosInstance.put(`/careLog/${diaryId}`, payload);
};


// ✅ 일지 삭제
export const deleteDiary = async (diaryId: number): Promise<void> => {
  await axiosInstance.delete(`/careLog/${diaryId}`);
};

