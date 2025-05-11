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
}

export interface CreateOrUpdatePostForm {
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  availableDates: AvailableTime[] ;
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
export const updatePost = async (
  postId: number,
  formData: CreateOrUpdatePostForm
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


// postAPI.ts (파일 맨 아래쪽에 추가)
export const mockPost: PostInfo = {
  id: 1,
  title: "산책 해드립니다!",
  content: "강아지 산책을 해드려요 🐶",
  availableAnimals: "0", // 0: 강아지, 1: 고양이
  price: 10000,
  files: [
    { id: 1, url: "/img/room01.jpg" },
    { id: 2, url: "/img/room02.jpg" },
  ],
  user: {
    id: 1,
    username: "doglover01",
    email: "test@example.com",
    nickname: "강쥐",
    gender: 0,
    address: "서울시 강남구",
    phone: "010-1234-5678",
    ratingAvg: 4.8,
    file: { id: 1, url: "/img/profile.jpeg" },
    reviewCount: 12,
  },
  availableTimes: [
    {
      start_Date: "2025-05-15T09:00:00",
      end_Date: "2025-05-15T11:00:00",
    },
    {
      start_Date: "2025-05-16T14:00:00",
      end_Date: "2025-05-16T17:00:00",
    },
  ],
};
