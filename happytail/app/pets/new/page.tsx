"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAnimalInfo } from "../api/PetAPI";
import ImageUploader from "@/app/common/ImageUploader";

export interface AnimalForm {
  name: string;
  type: number; // 1: 강아지, 2: 고양이, 3: 기타
  breed: string;
  additionalInfo: string;
  fileIds: number[];
}

const initialForm: AnimalForm = {
  name: "",
  type: 0,
  breed: "",
  additionalInfo: "",
  fileIds: [],
};

export default function NewPetPage() {
  const router = useRouter();
  const [form, setForm] = useState<AnimalForm>(initialForm);
  const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "type" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addAnimalInfo({ ...form, fileIds: uploadedFileIds }); // 서버에 동물 정보 추가 요청
      router.push("/pets");
    } catch (error) {
      alert("동물 등록에 실패했습니다.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">새 반려동물 추가하기</h1>
      <ImageUploader
        onUploadSuccess={setUploadedFileIds}
        url={"/img/default_pet.avif"}
      />
      <input
        type="text"
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded"
      >
        <option value={0}>강아지</option>
        <option value={1}>고양이</option>
      </select>

      <input
        type="text"
        name="breed"
        placeholder="품종"
        value={form.breed}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded"
      />

      <input
        type="text"
        name="additionalInfo"
        placeholder="기타 정보"
        value={form.additionalInfo}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-300 p-2 rounded mt-4 font-semibold"
      >
        새 반려동물 추가
      </button>
    </div>
  );
}
