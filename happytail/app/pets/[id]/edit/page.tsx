"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/pets/${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev: any) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    if (form.image instanceof File) {
      data.append("image", form.image);
    }
    data.append("name", form.name);
    data.append("age", form.age);
    data.append("personality", form.personality);
    data.append("feature", form.feature);
    data.append("etc", form.etc);

    await fetch(`/api/pets/${id}`, {
      method: "PUT",
      body: data,
    });

    router.push("/pets");
  };

  if (!form) return <div>로딩 중...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">내 반려동물 관리</h1>

      <label className="block mb-2">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <img
          src={form.imageUrl}
          alt="pet"
          className="w-full h-40 object-cover mt-2"
        />
      </label>

      {["name", "age", "personality", "feature", "etc"].map((key) => (
        <input
          key={key}
          type="text"
          name={key}
          placeholder={key}
          value={form[key]}
          onChange={handleChange}
          className="w-full border p-2 my-2 rounded"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-300 p-2 rounded mt-4 font-semibold"
      >
        수정 완료
      </button>
    </div>
  );
}
