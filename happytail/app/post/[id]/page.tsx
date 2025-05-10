"use client";

import { useParams } from "next/navigation";
import PostImageCarousel from "./PostImageCarousel";
import { getPostById, PostInfo } from "../api/postAPI";
import { useEffect, useState } from "react";
import { AvailableDateSelector } from "./AvailableDateSelecter";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PostInfo | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id as string);
        setPost(data);
      } catch (err) {
        console.error("❌ Failed to load post data:", err);
        setError(true);
      }
    };

    fetchPost();
  }, [id]);

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
      <div className="w-full max-w-xl px-6">
        <div className="w-full flex items-center justify-between py-3">
          <div className="flex items-center">
            <button onClick={() => window.history.back()}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold">{"<"}</span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold">게시글 작성</h1>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={post.user?.file?.url ?? "/img/profile.jpeg"}
            alt="작성자 이미지"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">
              {post.user?.nickname ?? "알 수 없음"}
            </div>
            <div className="text-sm text-gray-500">
              ⭐ {post.user?.ratingAvg} ({post.user?.reviewCount}건 완료)
            </div>
          </div>
        </div>

        <PostImageCarousel files={post.files} />

        <h2 className="text-lg font-bold">{post.title}</h2>
        <p className="text-sm text-gray-700 mb-2">{post.content}</p>
        <p className="text-sm text-gray-600">
          동물 종류: {post.availableAnimals == "0" ? "강아지" : "고양이"}
        </p>
        <p className="text-sm text-gray-600">
          가격: 시간당 {post.price.toLocaleString()}원
        </p>

        <div className="w-full h-px bg-yellow-400 my-6"></div>
        
        <label className="text-2xl font-bold">예약 가능 시간</label>

        <AvailableDateSelector availableDates={post.availableTimes} />

        <button className="mt-4 w-full bg-amber-300 hover:bg-amber-400 text-black font-semibold py-2 rounded">
          신청하기
        </button>
      </div>
    </div>
  );
}
