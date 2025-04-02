// next.config.ts
import { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // 이 설정 추가

  // 다른 Next.js 설정들...
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // 개발 환경에서는 PWA 기능 비활성화
})(nextConfig);
