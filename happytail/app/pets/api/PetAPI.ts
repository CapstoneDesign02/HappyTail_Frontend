import axiosInstance from "@/app/common/axiosInstance";
import { File } from "@/app/common/fileType";
import { AnimalForm } from "../new/page";

export interface AnimalInfo {
  id?: number;
  name: string;
  type: number; //0: 강아지 1:고양이 2:기타
  breed: string;
  additionalInfo?: string;
  files: File[] | undefined; // 이미지 파일
}

// ✅ 동물 정보 가져오기
export const getAnimalInfo = async (): Promise<AnimalInfo[]> => {
  try {
    const response = await axiosInstance.get("/animal-info");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch animal info:", error);
    throw error;
  }
};

// ✅ 동물 정보 등록
export const addAnimalInfo = async (animalData: AnimalForm) => {
  try {
    const response = await axiosInstance.post("/animal-info", animalData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to add animal info:", error);
    throw error;
  }
};

// ✅ 동물 정보 수정
export const updateAnimalInfo = async (id: number, updatedData: AnimalForm) => {
  try {
    const response = await axiosInstance.put(`/animal-info/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update animal info:", error);
    throw error;
  }
};

// ✅ 동물 정보 삭제
export const deleteAnimalInfo = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/animal-info/${id}`);
  } catch (error) {
    console.error("❌ Failed to delete animal info:", error);
    throw error;
  }
};

// ✅ 동물 정보 상세 조회
export const getAnimalInfoById = async (id: string): Promise<AnimalInfo> => {
  try {
    const response = await axiosInstance.get(`/animal-info/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete animal info:", error);
    throw error;
  }
};
