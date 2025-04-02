// next.config.ts
import { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // 이 설정 추가
  images: {
    domains: [
      "localhost",
      "happytail-hqfso996r-eunseos-projects.vercel.app",
      "happy-tail-frontend.vercel.app",
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // 개발 환경에서는 PWA 기능 비활성화
})(nextConfig);
