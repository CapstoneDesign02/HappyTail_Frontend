import axiosInstance from "@/app/common/axiosInstance";
import { AnimalProfile } from "@/app/reservation/api/reservationAPI";

export interface FileData {
  id: number;
  url: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
  gender: number;
  address: string;
  phone: string;
  ratingAvg: number;
  file: FileData;
  reviewCount: number;
}

export interface AvailableTime {
  start_Date: string;
  end_Date: string;
}

export interface PostInfo {
  id: number;
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  files: FileData[] | null;
  user: UserInfo | null;
  availableTimes: AvailableTime[];
  animalProfiles: AnimalProfile[] | null;
}

export interface CreateOrUpdatePostForm {
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  availableTimes: AvailableTime[]; // ✅ 수정
  fileIds: number[];
}

export interface CreateOrUpdatePostFormMy {
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  availableDates: AvailableTime[]; // ✅ 수정
  fileIds: number[];
}

interface MyPost {
  data: PostInfo[];
  message: string;
  status: string;
}

// ✅ 전체 게시글 조회
export const getAllPosts = async (): Promise<PostInfo[]> => {
  try {
    const response = await axiosInstance.get("/post");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch all posts:", error);
    throw error;
  }
};
// ✅ 전체 게시글 조회
export const getMyPost = async (): Promise<MyPost> => {
  try {
    const response = await axiosInstance.get("/post/mypost");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch all posts:", error);
    throw error;
  }
};

export const deleteMyPost = async (postId: number) => {
  try {
    const response = await axiosInstance.delete(`/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to delete my post with ID ${postId}:`, error);
    throw error;
  }
};

// ✅ 단일 게시글 조회
export const getPostById = async (postId: string): Promise<PostInfo> => {
  try {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch post with ID ${postId}:`, error);
    throw error;
  }
};

// ✅ 게시글 작성
export const createPost = async (formData: CreateOrUpdatePostFormMy) => {
  try {
    const response = await axiosInstance.post("/post", formData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create post:", error);
    throw error;
  }
};

// ✅ 게시글 수정
export const updatePost = async (
  postId: number,
  formData: CreateOrUpdatePostFormMy
) => {
  try {
    const response = await axiosInstance.put(`/post/${postId}`, formData);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to update post with ID ${postId}:`, error);
    throw error;
  }
};

// ✅ 게시글 삭제
export const deletePost = async (postId: number) => {
  try {
    const response = await axiosInstance.delete(`/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to delete post with ID ${postId}:`, error);
    throw error;
  }
};

// ✅ 예약하기
export const createReservation = async (
  id: string,
  animalId: number,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await axiosInstance.post(`/reservation/apply/${id}`, {
      animalId,
      startDate,
      endDate,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to reservation:", error);
    throw error;
  }
};
