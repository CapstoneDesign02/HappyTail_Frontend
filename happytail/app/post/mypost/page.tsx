"use client";

import { useEffect, useState } from "react";
import { deleteMyPost, getMyPost, PostInfo } from "../api/postAPI";
import { useRouter } from "next/navigation";
import { AvailableDateSelector } from "../[id]/AvailableDateSelecter";
import PostImageCarousel from "../[id]/PostImageCarousel";

export default function MyPost() {
  const router = useRouter();
  const [post, setPost] = useState<PostInfo | "NOT_FOUND" | null>(null);

  useEffect(() => {
    const fetchMyPost = async () => {
      try {
        const response = await getMyPost();
        if (response.status === "SUCCESS" && response.data[0]) {
          setPost(response.data[0]);
          console.log("✅ post.title:", response);
        } else {
          setPost("NOT_FOUND");
          router.push("/post/posting");
        }
      } catch (error) {
        console.error("❌ Failed to load my posts:", error);
        setPost("NOT_FOUND");
      }
    };
    fetchMyPost();
  }, []);

  if (post === null) {
    return (
      <div className="w-full text-center py-10 text-gray-500 font-medium">
        불러오는 중...
      </div>
    );
  }

  if (post === "NOT_FOUND") {
    return (
      <div className="w-full text-center py-10 text-red-500 font-semibold">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden flex flex-col items-center min-h-screen font-bold text-black bg-white pb-24 px-4 w-[80%] w-min-[400px]  mx-auto font-['NanumSquareRound']">
      <div className="w-full flex items-center justify-between py-3">
        <div className="flex items-center">
          <button onClick={() => router.push("/post")}>
            <div className="w-12 h-12 flex items-center justify-center mr-4">
              <span className="text-3xl font-extrabold">{"<"}</span>
            </div>
          </button>
          <h1 className="text-2xl font-extrabold">내가 작성한 게시글</h1>
        </div>
      </div>

      <div className="w-full h-px bg-yellow-400 mb-6"></div>

      <div className="bg-white rounded-xl p-4">
        <h1 className="text-xl font-extrabold mb-4">
          제목: {post.title ?? "제목 없음"}
        </h1>
        {post.files && post.files.length > 0 ? (
          <PostImageCarousel files={post.files} />
        ) : (
          <div className="text-gray-400 text-center my-4">
            이미지가 없습니다
          </div>
        )}

        <p className="text-lg font-semibold text-gray-700 mb-2">
          {post.content ?? "내용이 없습니다"}
        </p>

        <p className="text-xl text-gray-700 mt-5">
          동물 종류:{" "}
          {post.availableAnimals === "0"
            ? "강아지"
            : post.availableAnimals === "1"
            ? "고양이"
            : "알 수 없음"}
        </p>

        <p className="text-xl text-gray-700 mt-1">
          가격: 시간당 {post.price?.toLocaleString() ?? "0"}원
        </p>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        <label className="text-2xl font-bold">예약 가능 시간</label>

        {post.availableTimes && post.availableTimes.length > 0 ? (
          <AvailableDateSelector availableDates={post.availableTimes} />
        ) : (
          <p className="text-gray-500 mt-2">
            예약 가능 시간이 설정되지 않았습니다.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => router.push(`/post/edit`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          수정하기
        </button>
        <button
          onClick={async () => {
            const confirmDelete = confirm("정말 삭제하시겠습니까?");
            if (confirmDelete) {
              try {
                const res = await deleteMyPost(post.id);
                alert("삭제되었습니다.");
                router.push("/post"); // 메인 페이지로 이동
              } catch (error) {
                console.error("❌ 삭제 중 오류 발생:", error);
                alert("오류가 발생했습니다.");
              }
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
