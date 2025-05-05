"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";

interface Message {
  id?: string;
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  content: string;
  unread?: boolean;
  timestamp: string;
  imageUrl?: string;
}

export default function ChatPage() {
  const params = useParams();
  const chatRoomId = Array.isArray(params.chatRoomId)
    ? params.chatRoomId[0]
    : params.chatRoomId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const email = "user2@naver.com";

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_SOCKET_ID}/ws/chat?email=${email}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");

      setMessages([]); // 기존 메시지 초기화

      // 연결 완료 후 이전 메시지 요청
      ws.send(
        JSON.stringify({
          type: "fetchAll",
          chatRoomId,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Message Received:", data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
      console.log("❌ WebSocket Disconnected");
    };
  }, [chatRoomId]);

  const sendMessage = () => {
    if (!socket || !message.trim() || !chatRoomId) return;

    const senderId = "user2@naver.com";
    const receiverId = "user1@naver.com"; // TODO: 실제 receiverId 동적으로 받아오기

    const newMessage: Message = {
      chatRoomId,
      senderId: senderId || "",
      receiverId,
      content: message,
      timestamp: new Date().toISOString(),
    };

    socket.send(JSON.stringify(newMessage));
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
            {messages.map((msg, idx) => {
              const isMine = msg.senderId === "user2@naver.com";
              return (
                <div
                  key={idx}
                  className={`mb-4 flex ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-xs`}>
                    <div
                      className={`text-xs mb-1 ${
                        isMine
                          ? "text-right text-blue-600"
                          : "text-left text-gray-700"
                      }`}
                    >
                      {msg.senderId}
                    </div>
                    <div
                      className={`p-3 shadow-sm break-words text-sm ${
                        isMine
                          ? "bg-blue-500 text-white rounded-xl rounded-br-none"
                          : "bg-white text-gray-900 rounded-xl rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
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
