import axiosInstance from "@/app/common/axiosInstance";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`/userinfo`);
    return response.data;
  } catch (error) {
    console.error("Failed to update level:", error);
    throw error;
  }
};
