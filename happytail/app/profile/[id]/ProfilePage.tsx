"use client";

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/profileAPI";

type Review = {
  id: number;
  reservationId: number;
  rating: number;
  content: string;
};

type File = {
  id: number;
  url: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  nickname: string;
  gender: number;
  ssn: string;
  address: string;
  phone: string;
  ratingAvg: number;
  points: number;
  files: File[];
  receivedReviews: Review[];
};

export default function ProfilePage({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const data = await getUserProfile(id as string);
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to load user data:", err);
        setError(true);
      }
    };

    fetchUser();
  }, [id]);

  if (error) return notFound();
  if (!user) return <p>로딩 중...</p>;

  return (
    <div className="max-w-screen-sm mx-auto">
      <div className="flex items-center my-2">
        <button
          onClick={() => router.back()}
          className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            &lt;
          </span>
        </button>
        <h1 className="whitespace-nowrap text-2xl font-extrabold text-black">
          {user.nickname}님의 프로필
        </h1>
      </div>

      <div className="w-full h-px bg-yellow-400 my-6 mt-[2]"></div>

      <div className="flex flex-col items-center mt-6 mb-4">
        <Image
          src={user.files[0]?.url || "/img/profile.jpeg"}
          alt="프로필 이미지"
          width={96}
          height={96}
          priority
          className="w-24 h-24 rounded-full object-cover"
        />
        <h2 className="mt-2 text-lg font-semibold">{user.nickname}</h2>
      </div>

      <div className="flex justify-between items-center border-t pt-2 text-sm text-gray-700">
        <span className="font-semibold">후기</span>
        <span className="flex items-center gap-1">
          <FaStar className="text-yellow-500" />
          {user.ratingAvg.toFixed(1)} |{" "}
          {user.receivedReviews.length.toLocaleString()}건 완료
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {user.receivedReviews.map((review) => (
          <div key={review.id} className="border rounded shadow p-2">
            <div className="flex gap-1 mb-1 text-yellow-500">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-sm">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
