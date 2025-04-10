"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPetPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    personality: "",
    feature: "",
    etc: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    if (form.image) data.append("image", form.image);
    data.append("name", form.name);
    data.append("age", form.age);
    data.append("personality", form.personality);
    data.append("feature", form.feature);
    data.append("etc", form.etc);

    await fetch("/api/pets", {
      method: "POST",
      body: data,
    });

    router.push("/pets");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">새 반려동물 추가하기</h1>

      <label className="block mb-2">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className="bg-gray-300 h-40 mt-2 flex justify-center items-center">
          프로필 사진 업로드
        </div>
      </label>

      {["name", "age", "personality", "feature", "etc"].map((key) => (
        <input
          key={key}
          type="text"
          name={key}
          placeholder={
            key === "personality"
              ? "간단한 성격"
              : key === "etc"
              ? "기타 사항"
              : key
          }
          value={(form as any)[key]}
          onChange={handleChange}
          className="w-full border p-2 my-2 rounded"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-300 p-2 rounded mt-4 font-semibold"
      >
        새 반려동물 추가
      </button>
    </div>
  );
}
