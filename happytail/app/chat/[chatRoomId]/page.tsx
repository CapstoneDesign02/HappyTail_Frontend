"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/common/axiosInstance";

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  unread: boolean;
  timestamp: string;
}

export default function ChatPage() {
  const params = useParams();
  const chatRoomId = Array.isArray(params.chatRoomId)
    ? params.chatRoomId[0]
    : params.chatRoomId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!chatRoomId) return; // ✅ API 호출 방지
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/chat/messages/${chatRoomId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [chatRoomId]); // ✅ useEffect는 항상 같은 순서로 실행됨

  const sendMessage = async () => {
    if (!message.trim() || !chatRoomId) return;

    const newMessage = { chatRoomId, receiverId: "user123", content: message };
    const response = await axiosInstance.post(`/api/chat/send`, newMessage);

    setMessages((prevMessages) => [...prevMessages, response.data]);
    setMessage("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col h-full p-4">
      {chatRoomId ? (
        <>
          <div className="flex-grow overflow-auto bg-gray-100 p-4 rounded-lg shadow-md">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                <div className="text-sm font-medium text-gray-700">
                  {msg.senderId}
                </div>
                <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="메시지를 입력하세요"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              전송
            </button>
          </div>
        </>
      ) : (
        <p>Invalid Chat Room</p>
      )}
    </div>
  );
}
