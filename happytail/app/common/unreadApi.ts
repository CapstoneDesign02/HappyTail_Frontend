import axiosInstance from "@/app/common/axiosInstance";

export const getUnreadMessageCounts = async () => {
  try {
    const response = await axiosInstance.get(`/api/chat/unreadCount`);
    return response.data;
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw error;
  }
};
