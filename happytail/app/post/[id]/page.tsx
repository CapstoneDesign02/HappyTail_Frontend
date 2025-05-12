"use client";

import { useParams, useRouter } from "next/navigation";
import PostImageCarousel from "./PostImageCarousel";
import { getPostById, PostInfo } from "../api/postAPI";
import { useEffect, useState } from "react";
import { AvailableDateSelector } from "./AvailableDateSelecter";

export default function PostPage() {
  const router = useRouter();
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostInfo | "NOT_FOUND" | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id as string);

        // 확인용
        // const data = null;

        if (!data || !data.id) {
          setTimeout(() => {
            router.replace("/post/posting");
          }, 1500);
          
          setPost("NOT_FOUND");
          return;
        }

        setPost(data);
      } catch (err) {
        console.error("❌ Failed to load post data:", err);
        setError(true);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post === "NOT_FOUND") {
      const timeout = setTimeout(() => {
        router.replace("/post/posting");
      }, 1500);

      return () => clearTimeout(timeout); // cleanup
    }
  }, [post]);

  if (error) {
    return (
      <main className="p-4 max-w-md mx-auto text-center text-red-500">
        해당 글을 찾을 수 없습니다.
      </main>
    );
  }

  if (post === "NOT_FOUND") {
    return (
      <main className="p-4 max-w-md mx-auto text-center text-gray-500">
        글이 없습니다. <br />새 글 쓰기로 이동합니다...
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
    <div className="relative min-w-[320px] flex flex-col items-center w-full font-bold bg-white px-4 max-w-screen-sm mx-auto font-['NanumSquareRound']">
      <div className="w-full max-w-xl">
        <div className="w-full flex items-center justify-between py-3">
          <div className="flex items-center">
            <button onClick={() => window.history.back()}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold">{"<"}</span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold">{post.title}</h1>
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-yellow-400"></div>

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

        <PostImageCarousel files={post.files} />

        <p className="text-lg font-semibold text-gray-700 mb-2">
          {post.content}
        </p>
        <p className="text-xl text-gray-700 mt-5">
          동물 종류: {post.availableAnimals == "0" ? "강아지" : "고양이"}
        </p>
        <p className="text-xl text-gray-700 mt-1">
          가격: 시간당 {post.price.toLocaleString()}원
        </p>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        <label className="text-2xl font-bold">예약 가능 시간</label>

        <AvailableDateSelector availableDates={post.availableTimes} />

        <button
          onClick={() => router.push(`/post/${id}/reservation`)}
          className="mt-4 text-2xl w-full bg-amber-300 hover:bg-amber-400 text-black font-semibold py-3 rounded"
        >
          예약하러 가기
        </button>
      </div>
    </div>
  );
}
