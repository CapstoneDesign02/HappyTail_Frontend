// next.config.ts
import { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // standalone 모드로 배포를 시도해 보세요.Q
  images: {
    domains: ["localhost", "happytail.vercel.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "happytail-uploaded-files.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  sw: "sw.js", // 서비스 워커 파일명을 sw.js로 변경
})(nextConfig);
