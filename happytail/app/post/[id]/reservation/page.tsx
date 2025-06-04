"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createReservation, getPostById, PostInfo } from "../../api/postAPI";
import { AvailableRangeSelector } from "./ResevationCalendar";

export default function ReservationRegister() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<PostInfo | null>(null);
  const [error, setError] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPost = useCallback(async () => {
    try {
      const data = await getPostById(id as string);
      setPost(data);
    } catch (err) {
      console.error("❌ Failed to load post data:", err);
      setError(true);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]); // ✅ 이제 ESLint 경고 없음

  if (error) {
    return (
      <main className="p-4 max-w-md mx-auto text-center text-red-500">
        해당 글을 찾을 수 없습니다.
      </main>
    );
  }

  if (!post) {
    return (
      <main className="p-4 max-w-md mx-auto text-center text-gray-500">
        불러오는 중입니다...
      </main>
    );
  }

  return (
    <div className="relative min-w-[320px] flex flex-col items-center w-full min-h-screen font-bold bg-white pb-24 px-4 max-w-screen-sm mx-auto font-['NanumSquareRound']">
      <div className="w-full max-w-xl">
        <div className="w-full flex items-center justify-between py-3">
          <div className="flex items-center">
            <button onClick={() => window.history.back()}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold">{"<"}</span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold">예약하기</h1>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-yellow-400 pl-4"></div>

      <div className="bg-white rounded-xl p-4">
        <div
          className="flex items-center gap-2 mb-2 cursor-pointer"
          onClick={() => router.push(`/profile/${post.user?.id}`)}
        >
          <img
            src={post.user?.file?.url ?? "/img/profile.jpeg"}
            alt="작성자 이미지"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold text-lg">
              {post.user?.nickname ?? "알 수 없음"}
            </div>
            <div className="text-sm text-gray-500">
              ⭐ {post.user?.ratingAvg} ({post.user?.reviewCount}건 완료)
            </div>
          </div>
        </div>
        <p className="text-xl font-semibold text-gray-700 mb-4">{post.title}</p>{" "}
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {post.content}
        </p>
        <p className="text-lg text-gray-700 mt-5">
          동물 종류: {post.availableAnimals == "0" ? "강아지" : "고양이"}
        </p>
        <p className="text-lg text-gray-700 mt-1">
          가격: 시간당 {post.price.toLocaleString()}원
        </p>
        <div className="w-full h-px bg-yellow-400 my-6"></div>
        {/* 맡길 동물 선택기 */}
        <label className="text-2xl font-bold">맡길 동물 선택</label>
        <div className="space-y-5 mt-5">
          {post.animalProfiles?.map((animal) => (
            <label
              key={animal.id}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="animal"
                value={animal.id}
                checked={selectedAnimalId === animal.id}
                onChange={() => setSelectedAnimalId(animal.id)}
                className="w-5 h-5"
              />
              <img
                src={animal.files[0].url || "/img/default_pet.avif"}
                alt={animal.name}
                className="w-12 h-12 object-cover rounded"
              />
              <span className="text-lg font-semibold text-gray-700">
                {animal.name} | {animal.breed}
              </span>
            </label>
          ))}
        </div>
        <div className="w-full h-px bg-yellow-400 my-6"></div>
        {/* 예약 가능 날짜 선택기 */}
        <label className="text-2xl font-bold">예약 가능 시간</label>
        <AvailableRangeSelector
          onSelect={setSelectedDates}
          availableDates={post.availableTimes}
        />
        <button
          disabled={!selectedAnimalId || !selectedDates}
          onClick={async () => {
            try {
              if (!selectedAnimalId || !selectedDates) return;
              await createReservation(
                id as string,
                selectedAnimalId,
                selectedDates.start,
                selectedDates.end
              );
              alert("✅ 예약이 완료되었습니다!");
              router.push(`/reservation`);
            } catch (e) {
              console.error("❌ 예약 중 오류 발생:", e);
              alert("❌ 예약 중 오류가 발생했습니다.");
            }
          }}
          className="mt-4 text-2xl w-full bg-amber-300 hover:bg-amber-400 text-black font-semibold py-3 rounded disabled:opacity-50"
        >
          예약하기
        </button>
      </div>
    </div>
  );
}
