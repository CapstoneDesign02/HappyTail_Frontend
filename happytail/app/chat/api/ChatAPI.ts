import axiosInstance from "@/app/common/axiosInstance";
import { Reservation } from "../type/ChatType";

export const getChatInfo = async (
  reservationId: string
): Promise<Reservation> => {
  try {
    const response = await axiosInstance.get(`/api/chat/info/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch animal info:", error);
    throw error;
  }
};
