import axiosInstance from "@/app/common/axiosInstance";
import { UserInfo } from "../post/api/postAPI";

export type AnalysisEntry = {
  id: number;
  resevationId: string;
  predictedDate: string;
  predictedDisease: string;
  predictedProbability: number;
  fileUrl: string;
  userInfo: UserInfo;
};

export const getConditionList = async (reservationId: string) => {
  try {
    const response = await axiosInstance.get(`/pet-condition/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("❌", error);
    throw error;
  }
};

export const postCondition = async (filedId: string, reservationId: string) => {
  try {
    const response = await axiosInstance.get(
      `/pet-condition/predict/${filedId}/${reservationId}`
    );
    return response.data;
  } catch (error) {
    console.error("❌", error);
    throw error;
  }
};
