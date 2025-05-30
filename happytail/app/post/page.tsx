"use client";

import React, { useEffect, useState } from "react";
import { getAllPosts } from "./api/postAPI";
import { PostInfo } from "./api/postAPI";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { removeCookie } from "../common/cookie";
import { getUnreadMessageCounts } from "../common/unreadApi";

export default function PostListStyledPage() {
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllPosts();
        const unreadMessage = await getUnreadMessageCounts();
        setUnreadCount(unreadMessage);
        if (Array.isArray(data)) {
          setPosts(data);
          console.log("게시글 불러오기 성공", data);
        }
      } catch (error) {
        console.error("게시글 불러오기 실패", error);
      } finally {
        setIsLoading(false);
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
    { label: "0", icon: "/img/icons/dog.png" },
    { label: "1", icon: "/img/icons/cat.png" },
  ];

  const navItems = [
    { icon: "/img/icons/reservation.png", route: "/reservation" },
    { icon: "/img/icons/pets.png", route: "/pets" },
    { icon: "/img/icons/home.png", route: "/post" },
    { icon: "/img/icons/diary.png", route: "/diary" },
    { icon: "/img/icons/profile.png", route: "/profile" },
  ];

  return (
    <div className="relative w-[80%] w-min-[400px] flex flex-col items-center min-h-screen font-bold bg-white pb-24 px-4 mx-auto font-['NanumSquareRound']">
      {/* 슬라이딩 메뉴 */}
      {isMenuOpen && (
        <div className="text-black fixed inset-0 z-50 flex">
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
                  onClick={() => router.push("/profile")}
                  className="text-lg font-semibold cursor-pointer"
                >
                  내 프로필
                </li>
                <li
                  onClick={() => router.push("/pets")}
                  className="text-lg font-semibold cursor-pointer"
                >
                  반려동물 프로필
                </li>
                <li
                  onClick={() => router.push("/post/mypost")}
                  className="text-lg font-semibold cursor-pointer"
                >
                  내 게시글
                </li>
                <li
                  onClick={() => router.push("/reservation")}
                  className="text-lg font-semibold cursor-pointer"
                >
                  예약 목록
                </li>
                <li
                  onClick={() => router.push("/diary")}
                  className="text-lg font-semibold cursor-pointer"
                >
                  돌봄 일지
                </li>
                <li
                  onClick={() => router.push("/review")}
                  className="text-lg font-semibold cursor-pointer"
                >
                  후기
                </li>
              </ul>
            </div>
            <div className="pt-4">
              <li
                className="list-none text-lg font-semibold cursor-pointer"
                onClick={() => {
                  removeCookie("token");
                  router.push("/info");
                }}
              >
                로그아웃
              </li>
            </div>
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

      {/* 필터 메뉴 */}
      <div className="w-full grid grid-cols-2 gap-2 py-4 text-center">
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
            </button>
          );
        })}
      </div>

      {/* 최근 목록 */}
      <div className="w-full">
        <h2 className="text-black text-lg font-bold mb-2">최근 목록</h2>
        {isLoading ? (
          <div className="text-gray-500 text-center py-8">불러오는 중...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            게시글이 없습니다.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => router.push(`/post/${post.id}`)}
              className="flex items-center w-full h-28 rounded-3xl bg-white/70 mb-4 overflow-hidden shadow cursor-pointer"
            >
              <img
                src={post.user?.file?.url ?? "/img/profile.jpeg"}
                alt="작성자 이미지"
                className="w-20 h-20 rounded-full ml-4 object-cover"
              />
              <div className="flex-1 ml-4 mr-4">
                <div className="text-black text-base font-bold">
                  {post.user?.nickname || "제니제니"}
                </div>
                <div className="text-sm text-gray-700 truncate">
                  {post.title}{" "}
                  {post.availableAnimals == "0"
                    ? "강아지"
                    : post.availableAnimals == "1"
                    ? "고양이"
                    : "기타"}
                </div>
                <div className="text-sm text-gray-500">
                  ⭐ {post.user?.ratingAvg} | {post.user?.reviewCount} 건 완료
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 네비게이션 */}
      <footer className="w-full w-min-[400px] h-20 bg-amber-100 flex justify-around items-center fixed bottom-0 left-0 right-0 mx-auto">
        {navItems.map(({ icon, route }, i) => (
          <button
            key={i}
            onClick={() => router.push(route)}
            className="relative w-14 h-14 flex items-center justify-center"
          >
            <Image src={icon} alt="nav-icon" width={60} height={60} />
            {route === "/reservation" && unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        ))}
      </footer>
    </div>
  );
}
