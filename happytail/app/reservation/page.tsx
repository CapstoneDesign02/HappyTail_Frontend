"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function reservation() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
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
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTimeChange = (day: string, idx: number, value: string) => {
    const updated = [...weeklyTime[day]];
    updated[idx] = value;
    setWeeklyTime({ ...weeklyTime, [day]: updated });
  };

  const addTimeSlot = (day: string) => {
    setWeeklyTime({ ...weeklyTime, [day]: [...weeklyTime[day], ""] });
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  const handleSubmit = () => {
    // 여기에 제출 로직 (예: API 호출)
    alert("제출 완료");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white text-black">
      <div className="w-full max-w-xl px-6 pb-8">
        <div className="w-full flex items-center justify-between py-6">
          {/* 뒤로가기 */}
          <div className="flex items-center">
            <button onClick={handleGoBack}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold">{"<"}</span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold">개인 정보 관리</h1>
          </div>
        </div>
        <div className="w-full h-px bg-yellow-400 my-6"></div>
        

        {/* 이미지 업로드 */}
        <div className="mb-6">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="preview"
              width={150}
              height={150}
              className="rounded-[20px] border border-black/30"
            />
          ) : (
            <div className="w-36 h-36 border border-black/30 rounded-[20px] flex items-center justify-center text-gray-400">
              미리보기
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>
        

        {/* 제목 */}
        <div className="mb-4">
          <label className="text-3xl font-bold">제목</label>
          <input
            className="w-full h-16 border border-black/30 rounded px-4 text-2xl mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
          />
        </div>

        {/* 설명 */}
        <div className="mb-6">
          <label className="text-3xl font-bold">자세한 설명</label>
          <textarea
            className="w-full h-[300px] border border-black/30 rounded px-4 py-2 text-xl mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명"
          />
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        {/* 날짜 선택 */}
        <div className="mb-6">
          <div className="text-3xl font-bold mb-4">날짜와 시간</div>
          <div className="grid grid-cols-7 gap-2 text-center text-xl font-bold">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day}>{day}</div>
            ))}
            {[...Array(31).keys()].map((d) => {
              const day = d + 1;
              return (
                <button
                  key={day}
                  className={`p-2 rounded-full ${
                    selectedDate === day
                      ? "bg-indigo-400 text-white"
                      : "text-black/50"
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        {/* 요일 별 시간 */}
        <div className="mb-6">
          <div className="text-3xl font-bold mb-4">요일 별 시간</div>
          {Object.entries(weeklyTime).map(([day, times]) => (
            <div key={day} className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold w-10">{day}</span>
              </div>
              {times.map((t, idx) => (
                <input
                  key={idx}
                  className="w-full max-w-[400px] h-12 border border-black/30 rounded px-4 text-lg mb-2"
                  placeholder="00:00 ~ 00:00"
                  value={t}
                  onChange={(e) => handleTimeChange(day, idx, e.target.value)}
                />
              ))}
              <button
                onClick={() => addTimeSlot(day)}
                className="ml-2 px-3 py-1 rounded-full bg-yellow-100 border shadow text-2xl text-amber-500"
              >
                +
              </button>
            </div>
          ))}
        </div>

        {/* 제출 */}
        <button
          onClick={handleSubmit}
          className="w-full h-16 bg-yellow-400 text-white text-2xl font-bold rounded hover:bg-yellow-500 transition"
        >
          글 등록하기
        </button>
      </div>
    </div>
  );
}
