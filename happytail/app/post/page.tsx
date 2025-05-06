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

const isPartner = true;

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
    <div className="relative min-w-[320px] flex flex-col items-center w-full min-h-screen font-bold bg-white pb-24 px-4 max-w-screen-sm mx-auto font-['NanumSquareRound']">
      {/* 슬라이딩 메뉴 */}
      {isMenuOpen && (
        <div className="text-black fixed inset-0 z-50 flex">
          {/* 슬라이드 메뉴 패널 */}
          <div className="w-64 max-h-screen overflow-y-auto bg-white shadow-lg p-6 flex flex-col justify-between">
            <div className="space-y-4">
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
                  onClick={() => router.push("/post/posting")}
                >
                  글 쓰기
                </li>
                <li
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => router.push("/reservation")}
                >
                  예약 목록
                </li>
                <li
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => router.push("/chat")}
                >
                  채팅
                </li>
                <li
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => router.push("/diary")}
                >
                  돌봄 일지
                </li>
                <li
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => router.push("/review")}
                >
                  후기
                </li>
              </ul>
            </div>

            {/* 하단 고정 로그아웃 */}
            <div className="pt-4">
              <li
                className="list-none text-lg font-semibold cursor-pointer"
                onClick={() => console.log("로그아웃 처리")}
              >
               로그아웃
              </li>
            </div>
          </div>

          {/* 어두운 배경 */}
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

      {/* 필터 메뉴 한 줄 */}
      <div className="w-full grid grid-cols-4 gap-2 py-4 text-center">
        {filterItems.map(({ label, icon }) => {
          const isActive = activeFilter === label;

          return (
            <button
              key={label}
              onClick={() => setActiveFilter(isActive ? null : label)}
              className={`relative flex flex-col items-center justify-end h-20 px-2 rounded-xl font-['BRR'] transition-all duration-200 ${
                isActive
                  ? "bg-yellow-300 pb-1.5 pt-1"
                  : "bg-transparent pb-1 pt-1"
              }`}
            >
              <div className="relative w-12 sm:w-16 aspect-square">
                <Image
                  src={icon}
                  alt={label}
                  fill
                  sizes="(min-width: 768px) 48px, 44px"
                  className={`${
                    isActive ? "brightness-0 invert" : ""
                  } object-contain`}
                />
              </div>

              <span className="text-xs text-black mt-1"></span>
            </button>
          );
        })}
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

      {isPartner && (
        <div className="absolute bottom-24 right-4 group">
          <button
            onClick={() => router.push("/post/posting")}
            className="bg-amber-400 hover:bg-amber-500 text-white text-xl font-bold rounded-full shadow-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all"
          >
            +
          </button>
          <div className="absolute top-1/2 right-full mr-2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            새 글 쓰기
          </div>
        </div>
      )}
    </div>
  );
}
