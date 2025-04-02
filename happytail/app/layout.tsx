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
    icon: "/webLogo.png", // 아이콘 경로
    apple: "/webLogo.png", // Apple Touch 아이콘 경로
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
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials"/>
        <meta name="theme-color" content="#000000" />
        {/* Favicon 설정 */}
        <link rel="icon" href="/webLogo.png" />
        {/* Apple Touch 아이콘 설정 */}
        <link rel="apple-touch-icon" href="/webLogo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
