// components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
    >
      <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
        &lt;
      </span>
    </button>
  );
}
