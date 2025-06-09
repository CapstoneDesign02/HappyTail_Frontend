"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDiaryById, updateDiary } from "../../api/DiaryAPI";
import axiosInstance from "@/app/common/axiosInstance";
import Image from "next/image";

export default function DiaryEditPage() {
  const { id } = useParams();
  const diaryId = Number(id);
  console.log("📌 diaryId:", diaryId);
  const router = useRouter();

  const [logContent, setLogContent] = useState("");
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [resolvedReservationId, setResolvedReservationId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!diaryId) return;

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
  }, [diaryId]);

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
    setLoading(true);

    try {
      const uploaded = await Promise.all(newImages.map(uploadImage));
      const allFileIds = [...existingImages.map((img) => img.id), ...uploaded];
      await updateDiary(diaryId, { logContent, fileIds: allFileIds });
      alert("수정되었습니다.");
      router.push(`/diary`);
    } catch (err) {
      console.error("❌ 수정 실패:", err);
      alert("오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-6 text-center">돌봄 일지 수정</h1>
      <div className="w-full h-px bg-yellow-400 mb-6" />

      <textarea
        className="w-full h-32 border rounded p-2 resize-none"
        value={logContent}
        onChange={(e) => setLogContent(e.target.value)}
      />

      <div className="my-4">
        <label className="block font-semibold mb-1">사진 및 영상</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {existingImages.map((img) => (
            <div key={img.id} className="relative">
              <Image
                src={img.url}
                alt="old"
                width={80}
                height={80}
                className="rounded border"
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

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="w-1/2 bg-gray-300 py-2 rounded"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-1/2 bg-yellow-400 py-2 rounded"
        >
          {loading ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
