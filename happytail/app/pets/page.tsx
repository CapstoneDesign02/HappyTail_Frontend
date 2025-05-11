"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimalInfo, getAnimalInfo, deleteAnimalInfo } from "./api/PetAPI";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PetListPage() {
  const [pets, setPets] = useState<AnimalInfo[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetchPets();
  }, []);

  const navItems = [
    { icon: "/img/icons/reservation.png", route: "/reservation" },
    { icon: "/img/icons/pets.png", route: "/pets" },
    { icon: "/img/icons/home.png", route: "/post" },
    { icon: "/img/icons/diary.png", route: "/diary" },
    { icon: "/img/icons/profile.png", route: "/profile" },
  ];

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
      console.error("❌ 동물 정보를 삭제하는 데 실패했습니다:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto">
      <div className="w-full max-w-screen-sm mt-4">
        <div className="flex items-center mb-2">
          <button
            onClick={() => router.back()}
            className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
          >
            <span className="text-3xl font-extrabold text-black font-['NanumSquareRound']">
              &lt;
            </span>
          </button>
          <h1 className="whitespace-nowrap text-2xl font-extrabold text-black">
            내 반려동물 관리
          </h1>
        </div>
      </div>
      <div className="w-full h-px bg-yellow-400 my-6 mt-[2]"></div>

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
                <strong>타입:</strong>{" "}
                {pet.type == 0 ? "강아지" : pet.type == 1 ? "고양이" : "기타"}
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
      <div className="w-full h-px bg-yellow-400 my-6"></div>

      {/* 하단 네비게이션 */}
      <footer className="w-full h-20 bg-amber-100 flex justify-around items-center fixed bottom-0 left-0 right-0 mx-auto max-w-screen-sm">
        {navItems.map(({ icon, route }, i) => (
          <button
            key={i}
            onClick={() => router.push(route)}
            className="w-14 h-14 flex items-center justify-center"
          >
            <Image src={icon} alt="nav-icon" width={60} height={60} />
          </button>
        ))}
      </footer>
    </div>
  );
}
