// next.config.ts
import { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["localhost", "happytail.vercel.app"],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  sw: "sw.js", // 서비스 워커 파일명을 sw.js로 변경
})(nextConfig);
