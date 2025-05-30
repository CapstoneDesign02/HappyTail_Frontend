"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyPost,
  updatePost,
  PostInfo,
  AvailableTime,
  FileData,
} from "../api/postAPI";
import { DateRangeSelector } from "../posting/MultiRangeClaendar";
import axiosInstance from "@/app/common/axiosInstance";

export default function EditMyPost() {
  const router = useRouter();

  const [post, setPost] = useState<PostInfo | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(0);
  const [availableAnimals, setAvailableAnimals] = useState("0");
  const [availableDates, setAvailableDates] = useState<AvailableTime[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [fileIds, setFileIds] = useState<number[]>([]);

  // 새로 선택한 이미지들 (업로드 예정)
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchMyPost = async () => {
      try {
        const response = await getMyPost();
        if (response.status === "SUCCESS" && response.data[0]) {
          const myPost = response.data[0];
          setPost(myPost);
          setTitle(myPost.title ?? "");
          setContent(myPost.content ?? "");
          setPrice(myPost.price ?? 0);
          setAvailableAnimals(myPost.availableAnimals ?? "0");
          setAvailableDates(myPost.availableTimes ?? []);
          if (myPost.files) {
            setFiles(myPost.files);
            setFileIds(myPost.files.map((file) => file.id));
          }
        } else {
          alert("게시글을 찾을 수 없습니다.");
          router.back();
        }
      } catch (error) {
        console.error("❌ 게시글 로딩 실패:", error);
        alert("오류가 발생했습니다.");
        router.back();
      }
    };
    fetchMyPost();
  }, [router]);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  // 이미지 삭제 (기존 업로드된 파일 중 삭제)
  const handleRemoveExistingFile = (fileId: number) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    setFileIds((prev) => prev.filter((id) => id !== fileId));
  };

  // 이미지 삭제 (새로 선택한 파일 중 삭제)
  const handleRemoveSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 선택한 이미지 업로드 후 fileId 배열 반환
  const uploadImagesAndGetFileIds = async (): Promise<number[]> => {
    const uploadedFileIds: number[] = [];
    for (const file of selectedImages) {
      const formData = new FormData();
      formData.append("files", file);
      try {
        const res = await axiosInstance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedFileIds.push(res.data[0]);
      } catch (err) {
        console.error("❌ 이미지 업로드 실패:", err);
      }
    }
    return uploadedFileIds;
  };

  // 게시글 수정 처리
  const handleUpdate = async () => {
    if (!post) return;

    try {
      // 새로 선택한 이미지 업로드
      const newFileIds = await uploadImagesAndGetFileIds();

      // 기존 파일 중 삭제하지 않은 fileIds와 새로 업로드된 fileIds 합치기
      const combinedFileIds = [...fileIds, ...newFileIds];

      const result = await updatePost(post.id, {
        title,
        content,
        price,
        availableAnimals,
        availableDates,
        fileIds: combinedFileIds,
      });
      console.log("✅ 수정 결과:", result);
      router.push("/post/mypost");
      alert("게시글이 수정되었습니다.");
    } catch (err) {
      console.error("❌ 수정 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  if (!post) {
    return <div className="text-center py-10">불러오는 중...</div>;
  }

  return (
    <div className="max-w-screen-sm mx-auto p-4 font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-4">게시글 수정하기</h1>

      <label className="block font-semibold">제목</label>
      <input
        className="w-full border p-2 rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block font-semibold">내용</label>
      <textarea
        className="w-full border p-2 rounded mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <label className="block font-semibold">시간당 가격 (원)</label>
      <input
        type="number"
        className="w-full border p-2 rounded mb-4"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <label className="block font-semibold">동물 종류</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={availableAnimals}
        onChange={(e) => setAvailableAnimals(e.target.value)}
      >
        <option value="0">강아지</option>
        <option value="1">고양이</option>
      </select>

      <label className="block font-semibold text-xl mt-4 mb-2">
        예약 가능 날짜 선택
      </label>
      <DateRangeSelector setAvailableDates={setAvailableDates} />

      <div className="mt-6">
        <label className="block font-semibold mb-2">기존 업로드된 사진</label>
        {files.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {files.map((file) => (
              <div key={file.id} className="relative">
                <img
                  src={file.url}
                  alt="기존 업로드 이미지"
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingFile(file.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>업로드된 사진이 없습니다.</p>
        )}
      </div>

      <div className="mt-6">
        <label className="block font-semibold mb-2">새로 선택한 사진</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2"
        />
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="선택한 이미지"
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSelectedImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="bg-yellow-400 text-white px-4 py-2 rounded font-bold"
          onClick={handleUpdate}
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
