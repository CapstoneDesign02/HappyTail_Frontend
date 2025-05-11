"use client";

export default function AppBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-900">
      {/* 왼쪽: 로고 */}
      <h1 className="text-xl font-bold text-[#ffb031] dark:text-white">
        happytail
      </h1>
    </nav>
  );
}
