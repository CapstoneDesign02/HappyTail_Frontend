"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createReview,
  updateReview,
  getWrittenReviews,
  ReviewForm,
} from "../api/reviewAPI";
import StarRating from "./starRating";

export default function ReviewFormPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reservationId = searchParams.get("reservationId");
  

  const [reviewId, setReviewId] = useState<number | null>(null);
  const [form, setForm] = useState<ReviewForm>({ rating: 0, content: "" });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!reservationId) return;

    const fetchReview = async () => {
      try {
        const reviews = await getWrittenReviews();
        const matched = reviews.find(
          (r) => r.reservationId === Number(reservationId)
        );

        if (matched) {
          setIsEdit(true);
          setReviewId(matched.id);
          setForm({ rating: matched.rating, content: matched.content });
        }
      } catch (error) {
        console.error("❌ 리뷰 조회 실패:", error);
      }
    };

    fetchReview();
  }, [reservationId]);

  const handleSubmit = async () => {
    if (!form.content.trim()) {
      alert("내용을 입력해주세요");
      return;
    }

    const parsedReservationId = Number(reservationId);
    if (isNaN(parsedReservationId)) {
      alert("잘못된 예약 ID");
      return;
    }

    try {
      setLoading(true);

      if (typeof reviewId === "number" && reviewId > 0) {
        await updateReview(reviewId, form);
        alert("후기 수정 완료");
      } else {
        await createReview(parsedReservationId, form);
        alert("후기 작성 완료");
      }

      router.push("/review");
    } catch (error) {
      console.error("❌ 후기 저장 실패", error);
      alert("❌ 후기 저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "후기 수정" : "후기 작성"}
      </h1>
      <div className="w-full h-px bg-yellow-400 mb-6"></div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">별점</label>
        <StarRating
          value={form.rating}
          onChange={(val) => setForm({ ...form, rating: val })}
        />
      </div>

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
          {loading ? "저장 중..." : isEdit ? "저장" : "작성"}
        </button>
      </div>
    </div>
  );
}
