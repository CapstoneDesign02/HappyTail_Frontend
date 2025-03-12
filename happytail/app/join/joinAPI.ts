import axios from "axios";

export const joinAPI = async (
  email: string,
  username: string,
  address: string,
  gender: number,
  ssn: string,
  phone: string,
  nickname: string
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_ID}/join`,
      {
        email,
        username,
        address,
        gender,
        ssn,
        phone,
        nickname
      }
    ); // PUT 요청으로 변경
    return response.data;
  } catch (error) {
    console.error("Failed to update level:", error);
    throw error;
  }
};

export const checkNicknameAPI = async (
  nickname: string
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_ID}/check-nickname`,
      {
        nickname
      }
    ); // PUT 요청으로 변경
    return response.data;
  } catch (error) {
    console.error("Failed to update level:", error);
    throw error;
  }
};
