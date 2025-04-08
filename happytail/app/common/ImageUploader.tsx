"use client";

import { useState } from "react";
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
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setUploading(true);
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("업로드 성공:", res.data);

      onUploadSuccess(res.data); // 부모에게 전달!
    } catch (err) {
      console.error("업로드 실패:", err);
    } finally {
      setUploading(false);
    }
  };

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

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition disabled:bg-gray-300"
      >
        {selectedFiles ? "이미지 선택 완료" : "이미지 수정"}
      </button>
    </div>
  );
}
