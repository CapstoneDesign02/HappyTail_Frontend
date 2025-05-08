"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AnimalInfo,
  getAnimalInfoById,
  updateAnimalInfo,
} from "../../api/PetAPI";
import { AnimalForm } from "../../new/page";
import ImageUploader from "@/app/common/ImageUploader";

const initialForm: AnimalForm = {
  name: "",
  type: 0,
  breed: "",
  additionalInfo: "",
  fileIds: [],
};

export default function EditPetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<AnimalForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);
  const [img, setImage] = useState<string>("");
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data: AnimalInfo = await getAnimalInfoById(id as string);

        // AnimalInfo → AnimalForm으로 변환
        const converted: AnimalForm = {
          name: data.name,
          type: data.type,
          breed: data.breed,
          additionalInfo: data.additionalInfo ?? "",
          fileIds: data.files?.map((file: any) => file.id) ?? [],
        };

        if (data.files && data.files[0]) setImage(data.files[0].url);

        setForm(converted);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to load pet data:", err);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "type" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (uploadedFileIds.length > 0) {
        await updateAnimalInfo(Number(id), {
          ...form,
          fileIds: uploadedFileIds,
        });
      } else {
        await updateAnimalInfo(Number(id), {
          ...form,
        });
      }
      alert("동물 정보가 성공적으로 수정되었습니다.");
      router.push("/pets");
    } catch (err) {
      console.error(err);
      alert("동물 정보 수정에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="size-10 sm:size-12 bg-white shadow-md flex items-center justify-center mr-4"
        >
          <span className="text-3xl sm:text-4xl font-extrabold text-black font-['NanumSquareRound']">
            &lt;
          </span>
        </button>
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black">
          반려동물 정보 수정
        </h1>
      </div>
      {/* 이름 입력 */}
      <input
        type="text"
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded"
      />

      {/* 타입 선택 */}
      <label className="block mt-4 mb-1 font-semibold">동물 타입</label>
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value={0}>강아지</option>
        <option value={1}>고양이</option>
        <option value={2}>기타</option>
      </select>

      {/* 품종 입력 */}
      <input
        type="text"
        name="breed"
        placeholder="품종"
        value={form.breed}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded"
      />

      {/* 기타 정보 */}
      <textarea
        name="additionalInfo"
        placeholder="기타 정보"
        value={form.additionalInfo}
        onChange={handleChange}
        className="w-full border p-2 my-2 rounded h-24 resize-none"
      />

      <ImageUploader
        onUploadSuccess={setUploadedFileIds}
        url={img || "/img/default_pet.avif"}
      />

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-300 p-2 rounded mt-4 font-semibold"
      >
        수정 완료
      </button>
    </div>
  );
}
