"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getDiariesByReservation,
  updateDiary,
  writeDiary,
} from "../api/DiaryAPI";

export default function DiaryFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const { id } = useParams(); // reservationId 또는 diaryId
  const router = useRouter();

  const [logContent, setLogContent] = useState("");
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const diaryId = Number(id);

  useEffect(() => {
    if (!isEdit || !diaryId) return;

    const fetchDiary = async () => {
      try {
        const diaries = await getDiariesByReservation(diaryId);
        const target = diaries.find((d) => d.id === diaryId);
        if (!target) throw new Error("일지를 찾을 수 없습니다");

        setLogContent(target.logContent);
        setExistingImages(target.files.map((file) => ({ id: file.id, url: file.url })));
      } catch (err) {
        alert("일지를 불러오는 데 실패했습니다.");
        router.push("/diary");
      }
    };

    fetchDiary();
  }, [isEdit, diaryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    setNewImages((prev) => [...prev, ...selected]);
    const previews = selected.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleDeleteExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const uploadImage = async (file: File): Promise<number> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("이미지 업로드 실패");

    const result = await res.json();
    return result.fileId;
  };

  const handleSubmit = async () => {
    if (!logContent.trim()) return alert("내용을 입력해주세요.");
    if (!diaryId) return;

    try {
      setLoading(true);
      const uploadedIds = await Promise.all(newImages.map(uploadImage));
      const allFileIds = [...existingImages.map((img) => img.id), ...uploadedIds];

      if (isEdit) {
        await updateDiary(diaryId, { logContent, fileIds: allFileIds });
        alert("일지가 수정되었습니다.");
      } else {
        await writeDiary(diaryId, { logContent, fileIds: allFileIds });
        alert("일지가 등록되었습니다.");
      }

      sessionStorage.setItem("visitedEditPage", "true");
      router.push("/diary");
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
        <label className="block font-semibold mb-1">이미지</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {existingImages.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.url} alt="old" className="w-20 h-20 object-cover rounded border" />
              <button
                onClick={() => handleDeleteExistingImage(img.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
          {previewUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`preview-${i}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
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
