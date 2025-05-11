"use client";

import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import Image from "next/image";

interface ImageUploaderProps {
  onUploadSuccess: (ids: number[]) => void;
  url: string;
}

export default function ImageUploader({
  onUploadSuccess,
  url,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  // selectedFiles가 바뀔 때마다 자동 업로드
  useEffect(() => {
    const upload = async () => {
      if (!selectedFiles) return;

      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });

      try {
        const res = await axiosInstance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onUploadSuccess(res.data); // 부모에게 전달
      } catch (err) {
        console.error("업로드 실패:", err);
      }
    };

    upload();
  }, [selectedFiles]);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl w-full max-w-md mx-auto mb-10">
      <div className="flex justify-center mb-6">
        <div className="w-48 h-48 relative rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
          <Image
            src={selectedFiles ? URL.createObjectURL(selectedFiles[0]) : url}
            alt="User profile"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
    </div>
  );
}
