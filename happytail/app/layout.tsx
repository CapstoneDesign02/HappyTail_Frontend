import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HappyTail",
  description: "행복한 꼬리",
  icons: {
    icon: "/img/logo192.png", // PWA 아이콘 경로
    apple: "/img/logo192.png", // Apple Touch 아이콘 경로
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA 설정 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* Favicon 설정 (일반 브라우저용) */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/img/logo192.png"
        />

        {/* PWA 아이콘 설정 */}
        <link rel="apple-touch-icon" sizes="192x192" href="/img/logo192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/img/logo512.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
