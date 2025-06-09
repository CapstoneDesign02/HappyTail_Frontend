"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDiaryById, writeDiary } from "../api/DiaryAPI";
import Image from "next/image";
import axiosInstance from "@/app/common/axiosInstance";

export default function DiaryFormPage({
  isEdit = false,
}: {
  isEdit?: boolean;
}) {
  const router = useRouter();
  const { reservationId: reservationIdRaw, id } = useParams();
  const reservationId = Number(reservationIdRaw);
  const diaryId = Number(id);

  const [logContent, setLogContent] = useState("");
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);

  useEffect(() => {
    if (!isEdit || !diaryId) return;

    const fetchDiary = async () => {
      const diary = await getDiaryById(diaryId);
      if (!diary) {
        alert("일지를 찾을 수 없습니다.");
        router.back();
        return;
      }

      setLogContent(diary.logContent);
      setExistingImages(
        diary.files.map((file) => ({ id: file.id, url: file.url }))
      );
    };

    fetchDiary();
  }, [isEdit, diaryId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const selected = Array.from(files);

    setNewImages((prev) => [...prev, ...selected]);

    const newPreview = selected.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/")
        ? "image"
        : ("video" as "image" | "video"),
    }));

    setPreviewFiles((prev) => [...prev, ...newPreview]);
  };

  const handleDeleteExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const uploadImage = async (file: File): Promise<number> => {
    const formData = new FormData();
    formData.append("files", file);
    const res = await axiosInstance.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data[0];
  };

  const handleSubmit = async () => {
    if (!logContent.trim()) return alert("내용을 입력해주세요.");

    const idToUse = isEdit ? diaryId : reservationId;
    if (!idToUse || isNaN(idToUse)) {
      alert(
        isEdit ? "일지 ID가 유효하지 않습니다." : "예약 ID가 유효하지 않습니다."
      );
      return;
    }

    try {
      setLoading(true);
      const uploadedIds = await Promise.all(newImages.map(uploadImage));
      const allFileIds = [
        ...existingImages.map((img) => img.id),
        ...uploadedIds,
      ];

      if (isEdit) {
        await axiosInstance.post(`/careLog/${diaryId}`, {
          logContent,
          fileIds: allFileIds,
        });
        alert("일지가 수정되었습니다.");
      } else {
        await writeDiary(reservationId, { logContent, fileIds: allFileIds });
        alert("일지가 등록되었습니다.");
      }

      router.push(`/diary/${reservationId}`);
    } catch (err) {
      console.error("❌ 실패:", err);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "돌봄 일지 수정" : "돌봄 일지 작성"}
      </h1>
      <div className="w-full h-px bg-yellow-400 mb-6" />

      <div className="mb-6">
        <label className="block font-semibold mb-1">내용</label>
        <textarea
          className="w-full h-32 border rounded p-2 resize-none"
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1">사진 및 영상</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {existingImages.map((img) => (
            <div key={img.id} className="relative">
              <Image
                src={img.url}
                alt="old"
                width={80}
                height={80}
                className="object-cover rounded border"
              />
              <button
                onClick={() => handleDeleteExistingImage(img.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
          {previewFiles.map((file, i) =>
            file.type === "image" ? (
              <Image
                key={i}
                src={file.url}
                alt={`preview-${i}`}
                width={80}
                height={80}
                className="rounded border"
              />
            ) : (
              <video
                key={i}
                src={file.url}
                controls
                width={80}
                height={80}
                className="rounded border"
              />
            )
          )}
        </div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={() => router.back()}
          className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
        >
          {loading ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
