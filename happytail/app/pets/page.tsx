// app/pets/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Pet {
  id: string;
  name: string;
  age: string;
  personality: string;
  feature: string;
  etc: string;
  imageUrl: string;
}

export default function PetListPage() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    fetch("/api/pets")
      .then((res) => res.json())
      .then(setPets);
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">내 반려동물 관리</h1>
      {pets.map((pet) => (
        <div key={pet.id} className="border p-4 rounded-md mb-4">
          <div className="flex items-center gap-4">
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <p>
                <strong>이름:</strong> {pet.name}
              </p>
              <p>
                <strong>나이:</strong> {pet.age}
              </p>
              <p>
                <strong>성격:</strong> {pet.personality}
              </p>
              <p>
                <strong>특징:</strong> {pet.feature}
              </p>
              <p>
                <strong>기타:</strong> {pet.etc}
              </p>
            </div>
            <Link href={`/pets/${pet.id}/edit`}>
              <button className="text-yellow-500 hover:underline">✏️</button>
            </Link>
          </div>
        </div>
      ))}
      <Link href="/pets/new">
        <div className="mt-6 border-2 border-yellow-300 rounded-xl p-6 flex flex-col items-center hover:bg-yellow-50 cursor-pointer">
          <div className="text-4xl font-bold text-yellow-400">+</div>
          <div className="mt-2 text-sm">새 반려동물 추가하기</div>
        </div>
      </Link>
    </div>
  );
}
