"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { getCookie, removeCookie, setCookie } from "./cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ID,
  withCredentials: true, // 쿠키 포함 요청
});

// 요청 인터셉터 (Authorization 헤더 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token"); // 클라이언트에서 쿠키 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 처리 및 토큰 재발급)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const router = useRouter();
    const originalRequest = error.config;

    // 혼합 콘텐츠 오류 (Mixed Content) → 로그아웃 처리
    if (error.message.includes("Mixed Content")) {
      console.log("로그아웃", error.message);
      removeCookie("token");
      removeCookie("refreshToken");
      router.push("/");
      return Promise.reject(error);
    }

    // 401 오류 발생 시 → 토큰 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        // 리프레시 토큰으로 새 토큰 요청
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ID}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        );

        const { accessToken: newAccessToken } = response.data;

        // 새 토큰을 쿠키에 저장
        setCookie("token", newAccessToken); // 1일 유지

        // 기존 요청 다시 실행
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("토큰 갱신 실패", err);
        removeCookie("token");
        removeCookie("refreshToken");
        router.push("/");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
