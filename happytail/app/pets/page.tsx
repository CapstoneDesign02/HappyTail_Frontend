"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimalInfo, getAnimalInfo, deleteAnimalInfo } from "./api/PetAPI";

export default function PetListPage() {
  const [pets, setPets] = useState<AnimalInfo[]>([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const data = await getAnimalInfo();
      setPets(data);
    } catch (err) {
      console.error("❌ 동물 정보를 불러오는 데 실패했습니다:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteAnimalInfo(id);
      setPets((prev) => prev.filter((pet) => pet.id !== id)); // UI에서 바로 제거
    } catch (err) {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">내 반려동물 관리</h1>

      {pets.map((pet) => (
        <div key={pet.id} className="border p-4 rounded-md mb-4">
          <div className="flex items-start gap-4">
            <img
              src={pet.files?.[0]?.url || "/img/default_pet.avif"}
              alt={pet.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <p>
                <strong>이름:</strong> {pet.name}
              </p>
              <p>
                <strong>타입:</strong> {pet.type}
              </p>
              <p>
                <strong>품종:</strong> {pet.breed}
              </p>
              <p>
                <strong>추가정보:</strong> {pet.additionalInfo}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Link href={`/pets/${pet.id}/edit`}>
                <button className="text-yellow-500 hover:underline">✏️</button>
              </Link>
              <button
                onClick={() => handleDelete(pet.id!)}
                className="text-red-500 hover:underline"
              >
                🗑️
              </button>
            </div>
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
