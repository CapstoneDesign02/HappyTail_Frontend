import axiosInstance from "@/app/common/axiosInstance";

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
  points: number;
  file: FileData;
}

export interface AvailableTime {
  startDate: string;
  endDate: string | null;
  startTime: string;
  endTime: string;
}

export interface PostInfo {
  id: number;
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  files: FileData[] | null;
  user: UserInfo | null;
  availableTimes: AvailableTime[] | null;
}

export interface CreateOrUpdatePostForm {
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  availableDates: AvailableTime[];
  fileIds: number[];
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

// ✅ 단일 게시글 조회
export const getPostById = async (postId: number): Promise<PostInfo> => {
  try {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch post with ID ${postId}:`, error);
    throw error;
  }
};

// ✅ 게시글 작성
export const createPost = async (formData: CreateOrUpdatePostForm) => {
  try {
    const response = await axiosInstance.post("/post", formData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create post:", error);
    throw error;
  }
};

// ✅ 게시글 수정
export const updatePost = async (postId: number, formData: CreateOrUpdatePostForm) => {
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
