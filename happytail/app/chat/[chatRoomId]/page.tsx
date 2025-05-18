"use client";

import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import ServiceDetails from "./ServiceDetails";
import CareOptions from "./CareOptions";
import ChatMessage from "./ChatMessage";

export default function ChatScreen() {
  const chatRoomId = "chatroom-1";
  const senderId = "user2@naver.com";
  const receiverId = "user1@naver.com";

  const [messages] = useState([
    {
      chatRoomId,
      senderId,
      receiverId,
      content: "안녕하세요! 올데이 강아지 케어 신청자입니다.",
      timestamp: "2025-05-18T10:00:00Z",
    },
    {
      chatRoomId,
      senderId: receiverId,
      receiverId: senderId,
      content: "네! 잘 부탁드립니다 🐶",
      timestamp: "2025-05-18T10:01:00Z",
    },
    {
      chatRoomId,
      senderId,
      receiverId,
      content: "강아지 알레르기나 주의사항 있으실까요?",
      timestamp: "2025-05-18T10:02:30Z",
    },
    {
      chatRoomId,
      senderId: receiverId,
      receiverId: senderId,
      content:
        "닭고기 알레르기 있어서 급여 시 주의 부탁드려요. 닭고기 알레르기 있어서 급여 시 주의 부탁드려요.",
      timestamp: "2025-05-18T10:03:00Z",
    },
  ]);

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    alert("목데이터 보기 전용이라 메시지는 실제로 전송되지 않아요.");
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-screen-sm mx-auto bg-white font-['NanumSquareRound']">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <ChatHeader title="제니제니님과 채팅" />
      </div>

      {/* 서비스 정보 및 케어 옵션 */}
      <div className="px-4 border-b border-gray-100">
        <ServiceDetails
          imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/182aed5d24898bb6fb4a3284f9d877f194ab3aca"
          serviceName="올데이 강아지 케어"
          dateRange="2025년 2월 27일 ~ 2025년 3월 05일"
        />
        <CareOptions />
      </div>

      {/* 메시지 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            time={new Date(msg.timestamp).toLocaleTimeString()}
            text={msg.content}
            imageUrl="/img/logo192.png"
            isUser={msg.senderId === senderId}
          />
        ))}
      </div>

      {/* 하단 고정 입력창 */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-300 px-4 py-2 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-amber-400 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
}
