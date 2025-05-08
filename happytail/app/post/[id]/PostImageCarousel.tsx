"use client";

import { useState } from "react";

interface FileData {
  url: string;
}

export default function PostImageCarousel({
  files,
}: {
  files: FileData[] | null;
}) {
  if (!files || files.length === 0) {
    return null;
  }

  if (files.length === 1) {
    return (
      <img
        src={files[0].url}
        alt="게시글 이미지"
        className="w-full h-48 object-cover rounded-md mb-4"
      />
    );
  }

  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + files.length) % files.length);
  const next = () => setIndex((index + 1) % files.length);

  return (
    <div className="relative mb-4">
      <img
        src={files[index].url}
        alt={`게시글 이미지 ${index + 1}`}
        className="w-full h-48 object-cover rounded-md"
      />
      <button
        onClick={prev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-1 rounded-full"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-1 rounded-full"
      >
        ▶
      </button>
    </div>
  );
}
