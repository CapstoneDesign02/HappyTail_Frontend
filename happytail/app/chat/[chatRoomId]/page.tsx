"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ServiceDetails from "./ServiceDetails";
import CareOptions from "./CareOptions";
import ChatMessage from "./ChatMessage";
import { useParams } from "next/navigation";
import { getChatInfo } from "../api/ChatAPI";
import { Reservation } from "../type/ChatType";
import { Message } from "../page";
import { useRouter } from "next/navigation";

export default function ChatScreen() {
  const router = useRouter();
  const { chatRoomId } = useParams();
  const [data, setData] = useState<Reservation>();
  const [sender, setSender] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatInfo = async () => {
      const response = await getChatInfo(chatRoomId as string);
      if (!response) {
        router.push("/reservation");
      }
      setData(response);
      if (response?.ispartner) {
        setSender(response.partnerEmail);
        setReceiver(response.userEmail);
      } else {
        setSender(response.userEmail);
        setReceiver(response.partnerEmail);
      }
    };
    fetchChatInfo();
  }, [chatRoomId]);

  useEffect(() => {
    if (!chatRoomId || !sender) return;
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_SOCKET_ID}/ws/chat?email=${sender}&chatRoomId=${chatRoomId}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      ws.send(
        JSON.stringify({
          type: "fetchAll",
          chatRoomId,
          senderId: receiver,
          receiverId: sender,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "fetchAllResponse" && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else if (data.type === "readUpdate") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.receiverId === sender && msg.unread
              ? { ...msg, unread: false }
              : msg
          )
        );
      } else {
        setMessages((prev) => [...prev, data]);
      }

      ws.onclose = () => {
        console.log("❌ WebSocket Disconnected");
      };

      setSocket(ws);

      return () => {
        ws.close();
        setSocket(null);
      };
    };
  }, [chatRoomId, sender]);

  const sendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    const newMessage: Message = {
      chatRoomId: chatRoomId as string,
      senderId: sender,
      receiverId: receiver,
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      unread: true,
      type: "message",
    };

    socket.send(JSON.stringify(newMessage));
    setInputMessage("");
  };

  const notifyReadMessages = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "read",
        chatRoomId,
        senderId: receiver,
        receiverId: sender,
      })
    );

    setMessages((prev) =>
      prev.map((msg) =>
        msg.receiverId === sender && msg.unread
          ? { ...msg, unread: false }
          : msg
      )
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[100dvh] max-w-screen-sm mx-auto bg-white font-['NanumSquareRound']">
      {/* 상단 고정 헤더 */}
      {data && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <ChatHeader
            title={`${
              data.ispartner ? data.userNickname : data.partnerNickname
            }님과 채팅`}
          />
        </div>
      )}

      {/* 서비스 정보 및 케어 옵션 */}
      <div className="px-4 border-b border-gray-100">
        <ServiceDetails
          imageUrl={
            data?.ispartner
              ? data.userPhotoUrl
              : data?.partnerPhotoUrl || "/img/profile.jpeg"
          }
          serviceName={data?.postTitle || "서비스 제목"}
          dateRange={`${data?.startDate} ~ ${data?.endDate}`}
        />
        <CareOptions />
      </div>

      {/* 메시지 스크롤 영역 */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            notifyReadMessages();
          }
        }}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            time={msg.timestamp}
            text={msg.content}
            imageUrl={
              msg.senderId === sender && data?.ispartner
                ? data.partnerPhotoUrl
                : data?.userPhotoUrl || "/img/profile.jpeg"
            }
            isUser={msg.senderId === sender}
            unread={msg.unread}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 하단 고정 입력창 */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-300 px-4 py-2 flex items-center">
        <input
          type="text"
          value={inputMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // 줄바꿈 방지
              sendMessage();
            }
          }}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={sendMessage}
          className="bg-amber-400 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
}
