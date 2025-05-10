"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AvailableTime,
  CreateOrUpdatePostForm,
  createPost,
} from "../api/postAPI";
import axiosInstance from "@/app/common/axiosInstance";
import { DateRangeSelector } from "./MultiRangeClaendar";

export default function Post() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [animalType, setAnimalType] = useState<number>(1); // 1: 강아지, 2: 고양이, 3: 기타
  const [price, setPrice] = useState<number>(0);

  const [availableDates, setAvailableDates] = useState<AvailableTime[]>([]);
  const handleGoBack = () => router.back();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...files]);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const uploadImagesAndGetFileIds = async (): Promise<number[]> => {
    const fileIds: number[] = [];
    for (const file of selectedImages) {
      const formData = new FormData();
      formData.append("files", file);
      try {
        const res = await axiosInstance.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fileIds.push(res.data[0]);
      } catch (err) {
        console.error("❌ 이미지 업로드 실패:", err);
      }
    }
    return fileIds;
  };

  const handleSubmit = async () => {
    const fileIds = await uploadImagesAndGetFileIds();
    if (fileIds.length === 0) return alert("이미지 업로드 실패");

    const formData: CreateOrUpdatePostForm = {
      title,
      content: description,
      availableAnimals: animalType.toString(),
      price,
      availableDates,
      fileIds,
    };

    try {
      await createPost(formData);
      alert("글이 등록되었습니다.");
      router.push("/post");
    } catch (err) {
      console.error("❌ 글 등록 실패:", err);
      alert("글 등록 실패");
    }
  };

  return (
    <div className="relative overflow-x-hidden min-w-[320px] flex flex-col items-center w-full min-h-screen font-bold text-black bg-white pb-24 px-4 max-w-screen-sm mx-auto font-['NanumSquareRound']">
      <div className="w-full max-w-xl px-6">
        <div className="w-full flex items-center justify-between py-3">
          <div className="flex items-center">
            <button onClick={handleGoBack}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold">{"<"}</span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold">게시글 작성</h1>
          </div>
        </div>
        <div className="w-full h-px bg-yellow-400 mb-6"></div>
      </div>
      <div className="w-full max-w-xl px-6 pb-0">
        {/* 이미지 업로드 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mt-2">
            {previewUrls.length === 0 ? (
              <div className="w-[100px] h-[100px] rounded-lg border border-black/30 overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                미리보기
              </div>
            ) : (
              previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-[100px] h-[100px] rounded-lg border border-black/30 overflow-hidden flex items-center justify-center relative"
                >
                  <Image
                    src={url}
                    alt={`preview-${index}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedUrls = [...previewUrls];
                      updatedUrls.splice(index, 1);
                      setPreviewUrls(updatedUrls);

                      const updatedFiles = [...selectedImages];
                      updatedFiles.splice(index, 1);
                      setSelectedImages(updatedFiles);
                    }}
                    className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-4"
          />
        </div>

        {/* 제목 */}
        <div className="mb-6 ">
          <label className="text-2xl font-bold">제목</label>
          <input
            className="w-full h-16 border border-black/30 rounded px-4 text-1xl mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
          />
        </div>

        {/* 설명 */}
        <div className="mb-6">
          <label className="text-2xl font-bold">자세한 설명</label>
          <textarea
            className="w-full h-[300px] border border-black/30 rounded px-4 py-2 text-1xl mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명"
          />
        </div>

        <div className="mb-6">
          <label className="text-2xl font-bold">가능한 동물 유형</label>
          <select
            name="type"
            value={animalType}
            onChange={(e) => setAnimalType(Number(e.target.value))}
            className="w-full border p-4 my-2 rounded text-1xl"
          >
            <option value={0}>강아지</option>
            <option value={1}>고양이</option>
          </select>
        </div>

        <div className="mb-6 ">
          <label className="text-2xl font-bold">가격</label>
          <input
            className="w-full h-16 border border-black/30 rounded p-4 my-2 text-1xl mt-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="가격"
          />
        </div>
        <div className="w-full h-px bg-yellow-400 my-6"></div>
        
        <label className="text-2xl font-bold">예약 가능 시간</label>
        <DateRangeSelector setAvailableDates={setAvailableDates} />

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        {/* 제출 */}
        <button
          onClick={handleSubmit}
          className="w-full h-14 bg-yellow-400 text-white text-xl font-bold rounded hover:bg-yellow-500 transition"
        >
          글 등록하기
        </button>
      </div>
    </div>
  );
}
