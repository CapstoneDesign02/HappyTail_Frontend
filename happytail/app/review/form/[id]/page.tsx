"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createReview,
  updateReview,
  getWrittenReviews,
  ReviewForm,
} from "../../api/reviewAPI";
import StarRating from "./starRating";

export default function ReviewFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const reservationId = Number(id);

  const [form, setForm] = useState<ReviewForm>({ rating: 0, content: "" });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getWrittenReviews();
        const existing = reviews.find((r) => r.reservationId === reservationId);

        if (existing) {
          setForm({
            rating: existing.rating ?? 0,
            content: existing.content ?? "",
          });
          if (existing.rating > 0) setIsEditMode(true);
        }
      } catch (err) {
        console.error("❌ 리뷰 불러오기 실패:", err);
      }
    };

    fetchReview();
  }, [reservationId]);

  const handleSubmit = async () => {
    if (!form.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (form.rating <= 0) {
      alert("별점을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      console.log("전송할 데이터:", { reservationId, form });

      if (isEditMode) {
        const reviews = await getWrittenReviews();
        const existing = reviews.find((r) => r.reservationId === reservationId);

        if (existing) {
          console.log("수정 요청 시작:", existing.id, form);
          const result = await updateReview(existing.id, form);
          console.log("수정 결과:", result);
          alert("후기 수정 완료!");
        }
      } else {
        console.log("생성 요청 시작:", reservationId, form);
        const result = await createReview(reservationId, form);
        console.log("생성 결과:", result);
        alert("후기 작성 완료!");
      }

      router.push("/review");
    } catch (err) {
      console.error("❌ 저장 실패 상세:", err);
      alert(`저장 중 오류가 발생했습니다: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 font-['NanumSquareRound']">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isEditMode ? "후기 수정" : "후기 작성"}
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
          {loading ? "저장 중..." : isEditMode ? "수정" : "작성"}
        </button>
      </div>
    </div>
  );
}
