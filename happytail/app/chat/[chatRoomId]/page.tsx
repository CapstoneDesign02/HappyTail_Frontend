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

  // ✅ 💬 목데이터
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
      timestamp: "2025-05-18T10:01:00Z", // 또는 "2025-05-18 10:01:00"
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
        "닭고기 알레르기 있어서 급여 시 주의 부탁드려요.닭고기 알레르기 있어서 급여 시 주의 부탁드려요.닭고기 알레르기 있어서 급여 시 주의 부탁드려요.닭고기 알레르기 있어서 급여 시 주의 부탁드려요.닭고기 알레르기 있어서 급여 시 주의 부탁드려요.",
      timestamp: "2025-05-18T10:03:00Z",
    },
  ]);

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    alert("목데이터 보기 전용이라 메시지는 실제로 전송되지 않아요.");
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="sticky top-0 bg-white">
        {/* 상단 헤더 */}
        <ChatHeader title="제니제니님과 채팅" />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {/* 서비스 정보 */}
          <ServiceDetails
            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/182aed5d24898bb6fb4a3284f9d877f194ab3aca"
            serviceName="올데이 강아지 케어"
            dateRange="2025년 2월 27일 ~ 2025년 3월 05일"
          />

          {/* 케어 옵션 */}
          <div className="bg-white">
            <CareOptions />
          </div>
        </div>
      </div>

      {/* 메시지 말풍선 */}
      <div className="min-h-[57%]">
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

      {/* 하단 입력창 */}
      <div className="sticky bottom-0 h-fit flex items-center border-t border-gray-300 px-4 py-3 bg-white">
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
