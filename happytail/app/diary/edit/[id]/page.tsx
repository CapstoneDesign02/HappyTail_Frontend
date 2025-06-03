"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getDiariesByReservation,
  updateDiary,
} from "../../api/DiaryAPI"; // API 경로는 실제 경로로 조정

export default function DiaryEditPage() {
  const { id } = useParams(); // diaryId
  const router = useRouter();

  const [logContent, setLogContent] = useState("");
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        if (!id) return;
        const diaryId = Number(id);
        const diaries = await getDiariesByReservation(diaryId);
        const targetDiary = diaries.find((d) => d.id === diaryId);

        if (!targetDiary) throw new Error("일지를 찾을 수 없습니다.");

        setLogContent(targetDiary.logContent);
        setFileIds(targetDiary.files.map((file) => file.id));
        setExistingImages(
          targetDiary.files.map((file) => ({ id: file.id, url: file.url }))
        );
      } catch (error) {
        console.error("일지 불러오기 실패:", error);
        alert("일지 정보를 불러오는 데 실패했습니다.");
        router.push("/diary");
      }
    };

    fetchDiary();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    setNewImages((prev) => [...prev, ...selected]);
    const previews = selected.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
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

  const handleDeleteExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setFileIds((prev) => prev.filter((id) => id !== imageId));
  };

  const handleSubmit = async () => {
    if (!logContent.trim()) return alert("내용을 입력해주세요.");
    try {
      setLoading(true);

      const newFileIds = await Promise.all(newImages.map(uploadImage));
      const allFileIds = [...fileIds, ...newFileIds];

      await updateDiary(Number(id), {
        logContent,
        fileIds: allFileIds,
      });

      alert("일지가 수정되었습니다.");
      router.push("/diary");
    } catch (error) {
      console.error("일지 수정 실패:", error);
      alert("일지 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-6 text-center">돌봄 일지 수정</h1>
      <div className="w-full h-px bg-yellow-400 mb-6" />

      {/* 내용 입력 */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">내용</label>
        <textarea
          className="w-full h-32 border rounded p-2 resize-none"
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
        />
      </div>

      {/* 기존 이미지 */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">기존 이미지</label>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.url}
                alt={`existing-${img.id}`}
                className="w-20 h-20 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
                onClick={() => handleDeleteExistingImage(img.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 새 이미지 업로드 */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">새 이미지 추가</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <div className="flex flex-wrap gap-2 mt-2">
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`preview-${idx}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ))}
        </div>
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
