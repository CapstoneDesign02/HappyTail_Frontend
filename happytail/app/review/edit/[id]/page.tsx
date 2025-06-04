"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewForm, submitReview, getReviewById } from "../../api/reviewAPI";
import StarRating from "./starRating";

export default function ReviewWriteOrEditPage() {
  const { reservationId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ReviewForm>({ rating: 0, content: "" });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reviewId, setReviewId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/review/by-reservation/${reservationId}`);
        if (!res.ok) throw new Error("Not found");
        const review = await res.json();
        setForm({ rating: review.rating, content: review.content });
        setIsEdit(true);
        setReviewId(review.id);
      } catch {
        setIsEdit(false);
      }
    };

    if (reservationId) fetchReview();
  }, [reservationId]);

  const handleSubmit = async () => {
    if (!form.content.trim()) return alert("후기 내용을 입력해주세요.");

    const parsedId = parseInt(reservationId as string, 10);
    if (isNaN(parsedId)) {
      alert("잘못된 예약 정보입니다.");
      return;
    }

    try {
      setLoading(true);
      await submitReview(parsedId, form);
      alert(isEdit ? "후기가 수정되었습니다." : "후기가 등록되었습니다.");
      router.push("/review");
    } catch (error) {
      console.error("후기 저장 실패:", error);
      alert("후기 저장에 실패했습니다.");
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
