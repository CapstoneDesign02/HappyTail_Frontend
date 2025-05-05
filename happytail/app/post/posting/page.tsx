"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPost } from "../api/postAPI";
import axiosInstance from "@/app/common/axiosInstance";

interface AvailableTime {
  startDate: string;
  endDate: string | null;
  startTime: string;
  endTime: string;
}

interface CreateOrUpdatePostForm {
  title: string;
  content: string;
  availableAnimals: string;
  price: number;
  availableDates: AvailableTime[];
  fileIds: number[];
}

export default function Post() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [dateRangeStart, setDateRangeStart] = useState<number | null>(null);

  const [weeklyTime, setWeeklyTime] = useState<Record<string, string[]>>({
    일: [""],
    월: [""],
    화: [""],
    수: [""],
    목: [""],
    금: [""],
    토: [""],
  });

  const handleGoBack = () => router.back();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...files]);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTimeChange = (day: string, idx: number, value: string) => {
    const updated = [...weeklyTime[day]];
    updated[idx] = value;
    setWeeklyTime({ ...weeklyTime, [day]: updated });
  };

  const addTimeSlot = (day: string) => {
    setWeeklyTime({ ...weeklyTime, [day]: [...weeklyTime[day], ""] });
  };

  const handleRangeDateClick = (day: number) => {
    if (dateRangeStart === null) {
      setDateRangeStart(day);
      setSelectedDates([day]);
    } else {
      const start = Math.min(dateRangeStart, day);
      const end = Math.max(dateRangeStart, day);
      const range = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );
      setSelectedDates(range);
      setDateRangeStart(null);
    }
  };

  const uploadImagesAndGetFileIds = async (): Promise<number[]> => {
    const fileIds: number[] = [];
    for (const file of selectedImages) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axiosInstance.post("/file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileIds.push(res.data.id);
      } catch (err) {
        console.error("❌ 이미지 업로드 실패:", err);
      }
    }
    return fileIds;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handleSubmit = async () => {
    const fileIds = await uploadImagesAndGetFileIds();
    if (fileIds.length === 0) return alert("이미지 업로드 실패");

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const availableDates: AvailableTime[] = selectedDates.flatMap((day) =>
      Object.entries(weeklyTime).flatMap(([_, times]) =>
        times
          .filter((t) => t.includes("~"))
          .map((t) => {
            const [startTime, endTime] = t.split("~").map((s) => s.trim());
            const formattedDay = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            return {
              startDate: formattedDay,
              endDate: null,
              startTime,
              endTime,
            };
          })
      )
    );

    const formData: CreateOrUpdatePostForm = {
      title,
      content: description,
      availableAnimals: "강아지",
      price: 10000,
      availableDates,
      fileIds,
    };

    try {
      await createPost(formData);
      alert("글이 등록되었습니다.");
      router.push("/post/list");
    } catch (err) {
      alert("글 등록 실패");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white text-black">
      <div className="w-full max-w-xl px-6 pb-8">
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
      <div className="w-full max-w-xl px-6 pb-8">
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
        <div className="mb-20">
          <label className="text-2xl font-bold">자세한 설명</label>
          <textarea
            className="w-full h-[300px] border border-black/30 rounded px-4 py-2 text-1xl mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명"
          />
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        {/* 날짜 선택 */}
        <div className="mb-20">
          <div className="text-2xl font-bold mb-4">날짜와 시간</div>

          {/* 월 변경 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const prevMonth = new Date(year, month - 2); // 0-indexed
                setYear(prevMonth.getFullYear());
                setMonth(prevMonth.getMonth() + 1);
                setSelectedDates([]);
              }}
              className="text-xl font-bold"
            >
              ◀ 이전 달
            </button>
            <span className="text-xl font-bold">
              {year}년 {month}월
            </span>
            <button
              onClick={() => {
                const nextMonth = new Date(year, month);
                setYear(nextMonth.getFullYear());
                setMonth(nextMonth.getMonth() + 1);
                setSelectedDates([]);
              }}
              className="text-xl font-bold"
            >
              다음 달 ▶
            </button>
          </div>

          {/* 요일 표시 */}
          <div className="grid grid-cols-7 gap-2 text-center text-lg font-bold mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* 날짜 선택 */}
          <div className="grid grid-cols-7 gap-2 text-center text-lg">
            {[
              ...Array(getFirstDayOfWeek(year, month)).fill(null), // 앞에 빈칸 패딩
              ...Array(getDaysInMonth(year, month)).keys(),
            ].map((val, i) => {
              if (val === null) {
                return <div key={`empty-${i}`} />;
              }

              const day = val + 1;
              const isSelected = selectedDates.includes(day);

              return (
                <button
                  key={day}
                  className={`p-2 rounded-full transition ${
                    isSelected
                      ? "bg-indigo-500 text-white font-bold"
                      : "text-black/50"
                  }`}
                  onClick={() => handleRangeDateClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        {/* 요일별 시간 */}
        <div className="mb-20">
          <div className="text-2xl font-bold mb-4">요일 별 시간</div>
          {Object.entries(weeklyTime).map(([day, times]) => (
            <div key={day} className="mb-6">
              <div className="text-lg font-semibold mb-2">
                <span className="text-2xl font-bold w-10">{day}</span>
              </div>
              {times.map((t, idx) => {
                const [start, end] = t.split("~").map((s) => s.trim());
                const isLast = idx === times.length - 1;
                const showDelete = times.length > 1 && !isLast;
                const showAdd = isLast;

                return (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-3 mb-2"
                  >
                    <input
                      type="time"
                      className="flex-1 min-w-[150px] max-w-[200px] h-12 border border-black/30 rounded px-4 text-lg"
                      value={start || ""}
                      onChange={(e) => {
                        const newTime = `${e.target.value} ~ ${end || ""}`;
                        handleTimeChange(day, idx, newTime);
                      }}
                    />
                    <span className="text-lg">~</span>
                    <input
                      type="time"
                      className="flex-1 min-w-[150px] max-w-[200px] h-12 border border-black/30 rounded px-4 text-lg"
                      value={end || ""}
                      onChange={(e) => {
                        const newTime = `${start || ""} ~ ${e.target.value}`;
                        handleTimeChange(day, idx, newTime);
                      }}
                    />

                    {/* 삭제 버튼 */}
                    {showDelete && (
                      <button
                        onClick={() => {
                          const updated = times.filter((_, i) => i !== idx);
                          setWeeklyTime({ ...weeklyTime, [day]: updated });
                        }}
                        className="px-3 py-1 rounded-full bg-white-100 border shadow text-2xl text-red-500  hover:bg-yellow-200"
                      >
                        ×
                      </button>
                    )}

                    {/* ➕ 추가 버튼 (마지막 줄 전용) */}
                    {showAdd && (
                      <button
                        onClick={() => addTimeSlot(day)}
                        className="px-3 py-1 rounded-full bg-white-100 border shadow text-2xl text-amber-500 hover:bg-yellow-200"
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

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
