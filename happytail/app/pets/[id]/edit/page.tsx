// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { AnimalInfo, updateAnimalInfo } from "../../api/PetAPI";

// export default function EditPetPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [form, setForm] = useState<AnimalInfo | null>(null);

//   useEffect(() => {
//     const fetchPet = async () => {
//       try {
//         const res = await fetch(`/api/pets/${id}`);
//         const data = await res.json();
//         setForm(data);
//       } catch (err) {
//         console.error("❌ Failed to load pet data:", err);
//       }
//     };

//     fetchPet();
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) =>
//       prev
//         ? {
//             ...prev,
//             [name]: name === "type" ? Number(value) : value,
//           }
//         : null
//     );
//   };

//   const handleSubmit = async () => {
//     if (!form) return;

//     try {
//       await updateAnimalInfo(Number(id), {
//         name: form.name,
//         type: form.type,
//         breed: form.breed,
//         additionalInfo: form.additionalInfo,
//       });

//       router.push("/pets");
//     } catch (err) {
//       alert("동물 정보 수정에 실패했습니다.");
//     }
//   };

//   if (!form) return <div>로딩 중...</div>;

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h1 className="text-xl font-bold mb-4">반려동물 정보 수정</h1>

//       {(
//         [
//           ["name", "이름", "text"],
//           ["type", "동물 타입 (숫자)", "number"],
//           ["breed", "품종", "text"],
//         ] as const
//       ).map(([key, label, type]) => (
//         <input
//           key={key}
//           type={type}
//           name={key}
//           placeholder={label}
//           value={form[key]?.toString() || ""}
//           onChange={handleChange}
//           className="w-full border p-2 my-2 rounded"
//         />
//       ))}

//       <textarea
//         name="additionalInfo"
//         placeholder="추가 정보"
//         value={form.additionalInfo || ""}
//         onChange={handleChange}
//         className="w-full border p-2 my-2 rounded h-24 resize-none"
//       />

//       <button
//         onClick={handleSubmit}
//         className="w-full bg-yellow-300 p-2 rounded mt-4 font-semibold"
//       >
//         수정 완료
//       </button>
//     </div>
//   );
// }
