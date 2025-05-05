// profileAPI.ts
import axiosInstance from "@/app/common/axiosInstance";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`/userinfo`);
    return response.data;
  } catch (error) {
    console.error("Failed to get profile:", error);
    throw error;
  }
};

export const updateProfile = async (updatedData: {
  nickname?: string;
  phone?: string;
  address?: string;
  fileOrder?: number[];
}) => {
  try {
    const response = await axiosInstance.put(`/userinfo`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};
