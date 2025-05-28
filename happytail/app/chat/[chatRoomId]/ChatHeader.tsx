"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface ChatHeaderProps {
  title: string;
}

const ChatHeader = ({ title }: ChatHeaderProps) => {
  const router = useRouter();
  return (
    <>
      <div className="w-full max-w-xl px-6 mt-2 bg-white">
        <div className="flex items-center mb-2">
          <button
            onClick={() => router.back()}
            className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
              &lt;
            </span>
          </button>
          <h1 className="whitespace-nowrap text-2xl  font-extrabold text-black">
            {title}
          </h1>
        </div>
      </div>
      <div className="w-full h-px bg-yellow-400 my-0"></div>
    </>
  );
};

export default ChatHeader;
