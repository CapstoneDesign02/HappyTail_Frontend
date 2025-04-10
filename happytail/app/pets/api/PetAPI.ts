import axiosInstance from "@/app/common/axiosInstance";

// 동물 정보 가져오기
export const getAnimalInfo = async () => {
  try {
    const response = await axiosInstance.get("/animal-info");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch animal info:", error);
    throw error;
  }
};

// 동물 정보 등록하기
export const addAnimalInfo = async (animalData: {
  name: string;
  species: string;
  birthDate?: string;
  gender?: string;
}) => {
  try {
    const response = await axiosInstance.post("/animal-info", animalData);
    return response.data;
  } catch (error) {
    console.error("Failed to add animal info:", error);
    throw error;
  }
};

// 동물 정보 수정하기
export const updateAnimalInfo = async (
  id: number,
  updatedData: {
    name?: string;
    species?: string;
    birthDate?: string;
    gender?: string;
  }
) => {
  try {
    const response = await axiosInstance.put(`/animal-info/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update animal info:", error);
    throw error;
  }
};

// 동물 정보 삭제하기
export const deleteAnimalInfo = async (id: number) => {
  try {
    await axiosInstance.delete(`/animal-info/${id}`);
  } catch (error) {
    console.error("Failed to delete animal info:", error);
    throw error;
  }
};
