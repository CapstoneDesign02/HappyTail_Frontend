"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="cursor-pointer"
        >
          <Star
            size={28}
            fill={
              hovered !== null
                ? hovered >= star
                  ? "#facc15"
                  : "none"
                : value >= star
                ? "#facc15"
                : "none"
            }
            stroke="#facc15"
          />
        </button>
      ))}
    </div>
  );
}
