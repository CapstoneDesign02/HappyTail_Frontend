"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ReviewForm,
  submitReview,
  ReviewInfo,
  getReviewById,
} from "../../api/reviewAPI";
import StarRating from "./starRating";

export default function ReviewEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ReviewForm>({ rating: 0, content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 임시 목업 데이터
    // const mockReview: ReviewInfo = {
    //   id: Number(id),
    //   reservationId: 0,
    //   rating: 5,
    //   content: "기존 후기 내용",
    //   profileImage: "",
    // };
    // setForm({ rating: mockReview.rating, content: mockReview.content });

    const fetchReview = async () => {
      try {
        if (!id) return;
        console.log("🔍 id param:", id);
        console.log("🔍 token:", localStorage.getItem("accessToken"));
        const review = await getReviewById(Number(id));
        setForm({ rating: review.rating, content: review.content });
      } catch (error) {
        console.log("🔍 id param:", id);
        console.log("🔍 token:", localStorage.getItem("accessToken"));
        alert("리뷰 정보를 불러오는 데 실패했습니다.");
        router.push("/review");
      }
    };

    fetchReview();
  }, [id]);

  const handleSubmit = async () => {
    if (!form.content.trim()) return alert("후기 내용을 입력해주세요.");
    try {
      setLoading(true);
      await submitReview(Number(id), form);
      alert("후기가 수정되었습니다.");
      router.push("/review"); // 리스트 페이지로 이동
    } catch (error) {
      alert("후기 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("visitedEditPage", "true");
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-6 text-center">후기 수정</h1>
      <div className="w-full h-px bg-yellow-400 mb-6"></div>
      {/* 별점 선택 */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">별점</label>
        <StarRating
          value={form.rating}
          onChange={(val) => setForm({ ...form, rating: val })}
        />
      </div>

      {/* 내용 입력 */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">내용</label>
        <textarea
          className="w-full h-32 border rounded p-2 resize-none"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </div>

      <div className="flex justify-between gap-4">
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
