"use client";

import React, { useEffect, useState } from "react";
import { getAllPosts } from "./api/postAPI";
import { PostInfo } from "./api/postAPI";
import { useRouter } from "next/navigation";
import Image from "next/image";

const mockPosts: PostInfo[] = [
  {
    id: 1,
    title: "강아지 올데이 케어",
    content: "소형견ㆍ중형견 간병 가능",
    availableAnimals: "강아지",
    price: 20000,
    files: [{ id: 1, url: "/images/sample.jpg" }],
    user: {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      nickname: "제니제니",
      gender: 1,
      address: "서울시",
      phone: "01012345678",
      ratingAvg: 4.7,
      points: 100,
      file: { id: 1, url: "/images/profile.jpg" },
    },
    availableTimes: null,
  },
];

export default function PostListStyledPage() {
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        if (Array.isArray(data)) {
          setPosts(data);
          console.log("게시글 불러오기 성공", data);
        }
      } catch (error) {
        console.error("게시글 불러오기 실패", error);
        setPosts(mockPosts);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.includes(searchTerm) ||
      post.content.includes(searchTerm) ||
      post.availableAnimals.includes(searchTerm);
    const matchesFilter = activeFilter
      ? post.availableAnimals.includes(activeFilter)
      : true;
    return matchesSearch && matchesFilter;
  });

  const filterItems = [
    { label: "강아지", icon: "/img/icons/dog.png" },
    { label: "고양이", icon: "/img/icons/cat.png" },
    { label: "내 주변", icon: "/img/icons/around.png" },
    { label: "기간", icon: "/img/icons/date.png" },
  ];

  const navItems = [
    { icon: "/img/icons/reservation.png", route: "/reservation" },
    { icon: "/img/icons/chat.png", route: "/chat" },
    { icon: "/img/icons/home.png", route: "/post" },
    { icon: "/img/icons/diary.png", route: "/diary" },
    { icon: "/img/icons/profile.png", route: "/profile" },
  ];

  return (
    <div className="min-w-[320px] flex flex-col items-center w-full min-h-screen bg-white pb-24 px-4 max-w-screen-sm mx-auto">
      {/* 슬라이딩 메뉴 */}
      {isMenuOpen && (
        <div className="text-black fixed inset-0 z-50 flex">
          <div className="w-64 bg-white shadow-lg p-6 space-y-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-right w-full text-gray-500"
            >
              ✕ 닫기
            </button>
            <ul className="space-y-2">
              <li
                className="text-lg font-semibold cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                내 프로필
              </li>
              <li
                className="text-lg font-semibold cursor-pointer"
                onClick={() => router.push("/pets")}
              >
                내 반려동물
              </li>
              <li
                className="text-lg font-semibold cursor-pointer"
                onClick={() => router.push("/reservation")}
              >
                예약 목록
              </li>
              <li
                className="text-lg font-semibold cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("info");
                }}
              >
                로그아웃
              </li>
            </ul>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
      )}

      {/* 헤더 */}
      <header className="w-full h-20 flex items-center justify-between px-4 bg-amber-100 rounded-b-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Image
              src="/img/icons/menu.png"
              alt="menu"
              width={60}
              height={60}
            />
          </button>
          <span className="font-['Y_Onepick_TTF'] text-nowrap pr-4 text-2xl font-bold text-amber-800">
            행복한 꼬리
          </span>
        </div>
        <div className="relative w-3/5">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full pl-10 pr-4 py-2 bg-white text-sm border text-black border-gray-300"
            placeholder="검색어를 입력하세요"
          />
          <Image
            src="/img/icons/search.png"
            alt="search"
            width={20}
            height={20}
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </header>

      {/* 토글 + 필터 메뉴 한 줄 */}
      <div className="w-full grid grid-cols-4 gap-2 py-4 text-center">
        {filterItems.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() =>
              setActiveFilter(activeFilter === label ? null : label)
            }
            className={`flex flex-col items-center px-2 py-1 rounded-xl ${
              activeFilter === label ? "bg-yellow-300" : "bg-transparent"
            }`}
          >
            <Image
              src={icon}
              alt={label}
              width={40}
              height={40}
              className={`mb-1 ${
                activeFilter === label ? "brightness-0 invert" : ""
              }`}
            />
          </button>
        ))}
      </div>

      {/* 최근 목록 */}
      <div className="w-full">
        <h2 className="text-black text-lg font-bold mb-2">최근 목록</h2>
        {filteredPosts.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            게시글이 없습니다.
          </div>
        )}
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/post/${post.id}`)}
            className="flex items-center w-full h-28 rounded-3xl bg-white/70 mb-4 overflow-hidden shadow cursor-pointer"
          >
            <img
              src={post.user?.file?.url || "/default-user.png"}
              alt="profile"
              className="w-20 h-20 rounded-full ml-4 object-cover"
            />
            <div className="flex-1 ml-4 mr-4">
              <div className="text-black text-base font-bold">
                {post.user?.nickname || "제니제니"}
              </div>
              <div className="text-sm text-gray-700 truncate">
                {post.title}{" "}
                {post.availableAnimals && `ㆍ${post.availableAnimals}`}
              </div>
              <div className="text-sm text-gray-500">
                ⭐ 4.7 | 5,635 건 완료
              </div>
            </div>
          </div>
        ))}
      </div>

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
