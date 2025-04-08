"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getProfile, updateProfile } from "./api/profileAPI";
import { formatPhoneNumber } from "../common/formatPhonenumber";
import ImageUploader from "../common/ImageUploader";
import { FiCheck, FiSettings } from "react-icons/fi";
import { checkNicknameAPI } from "../join/joinAPI";

interface File {
  id: number;
  url: string;
}

interface UserProfile {
  id: number;
  nickname: string;
  username: string;
  points: number;
  gender: number;
  ssn: string;
  phone: string;
  address: string;
  email: string;
  files: File[];
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<UserProfile>>({});
  const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      if (data) {
        setUser(data);
        setEditedUser({
          nickname: data.nickname,
          address: data.address,
          phone: data.phone,
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleGoBack = () => router.back();

  const handleSave = async () => {
    try {
      // 닉네임이 기존과 다르면 중복 체크 수행
      if (editedUser.nickname && editedUser.nickname !== user?.nickname) {
        const check = await checkNicknameAPI(editedUser.nickname);
        if (check.isDuplicate) {
          alert("이미 사용 중인 닉네임입니다.");
          return;
        }
      }

      await updateProfile({
        nickname: editedUser.nickname,
        address: editedUser.address,
        phone: editedUser.phone,
        fileOrder: uploadedFileIds,
      });

      alert("수정되었습니다.");
      setEditMode(false);
      const updated = await getProfile();
      setUser(updated);
    } catch (e) {
      console.error("업데이트 오류:", e);
      alert("오류 발생!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white text-black">
      <div className="w-full max-w-xl px-6 pb-8">
        <div className="w-full flex items-center justify-between py-6">
          <div className="flex items-center">
            <button onClick={handleGoBack}>
              <div className="w-12 h-12 flex items-center justify-center shadow-md mr-4">
                <span className="text-3xl font-extrabold">{"<"}</span>
              </div>
            </button>
            <h1 className="text-2xl font-extrabold">개인 정보 관리</h1>
          </div>

          <button onClick={() => setEditMode(!editMode)}>
            <div className="w-12 h-12 flex items-center justify-center shadow-md rounded-full bg-gray-100">
              {editMode ? (
                <FiCheck size={28} className="text-green-600" />
              ) : (
                <FiSettings size={28} className="text-gray-600" />
              )}
            </div>
          </button>
        </div>

        <div className="w-full h-px bg-yellow-400 my-6"></div>

        {editMode ? (
          <ImageUploader
            onUploadSuccess={setUploadedFileIds}
            url={user?.files[0].url || "/img/profile.jpeg"}
          />
        ) : (
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 relative rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
              <Image
                src={user?.files[0].url || "/img/profile.jpeg"}
                alt="User profile"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <div className="w-full space-y-6">
          <div className="flex items-center">
            <div className="w-32 text-xl font-semibold">닉네임</div>
            {editMode ? (
              <input
                className="border px-2 py-1 rounded w-full"
                value={editedUser.nickname || ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, nickname: e.target.value })
                }
              />
            ) : (
              <div className="text-xl">{user?.nickname}</div>
            )}
          </div>

          <div className="flex items-center">
            <div className="w-32 text-xl font-semibold">이름</div>
            <div className="text-xl">{user?.username}</div>
          </div>

          <div className="flex items-center">
            <div className="w-32 text-xl font-semibold">성별</div>
            <div className="text-xl">
              {user?.gender === 1 ? "남성" : "여성"}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-32 text-xl font-semibold">휴대폰</div>
            {editMode ? (
              <input
                className="border px-2 py-1 rounded w-full"
                value={editedUser.phone || ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, phone: e.target.value })
                }
              />
            ) : (
              <div className="text-xl">
                {formatPhoneNumber(user?.phone || "")}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className="w-32 text-xl font-semibold">주소</div>
            {editMode ? (
              <input
                className="border px-2 py-1 rounded w-full"
                value={editedUser.address || ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, address: e.target.value })
                }
              />
            ) : (
              <div className="text-xl">{user?.address}</div>
            )}
          </div>

          <div className="flex items-center">
            <div className="w-32 text-xl font-semibold">이메일</div>
            <div className="text-xl">{user?.email}</div>
          </div>
        </div>

        {editMode && (
          <div className="mt-8 flex justify-end">
            <button
              className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold"
              onClick={handleSave}
            >
              저장하기
            </button>
          </div>
        )}

        <div className="w-full h-px bg-yellow-400 my-6"></div>
      </div>
    </div>
  );
};

export default UserProfilePage;
