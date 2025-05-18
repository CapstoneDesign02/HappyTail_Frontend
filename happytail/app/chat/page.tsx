"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";

interface Message {
  id?: string;
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  content: string;
  unread?: boolean;
  timestamp: string;
  imageUrl?: string;
  type?: string;
}

export default function ChatPage() {
  const chatRoomId = "1";
  const myEmail = "user1@naver.com";
  const otherEmail = "user2@naver.com";

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  useEffect(() => {
    if (!chatRoomId || !myEmail) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_SOCKET_ID}/ws/chat?email=${myEmail}&chatRoomId=${chatRoomId}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      ws.send(
        JSON.stringify({
          type: "fetchAll",
          chatRoomId,
          senderId: otherEmail, //2
          receiverId: myEmail, // 1
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);
      if (data.type === "fetchAllResponse" && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else if (data.type === "readUpdate") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === myEmail && msg.unread
              ? { ...msg, unread: false }
              : msg
          )
        );
      } else {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [chatRoomId, myEmail]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (!socket || !message.trim()) return;

    const newMessage: Message = {
      chatRoomId,
      senderId: myEmail,
      receiverId: otherEmail,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      unread: true,
      type: "message",
    };

    socket.send(JSON.stringify(newMessage));
    setMessage("");
  };

  const notifyReadMessages = () => {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "read",
        chatRoomId,
        senderId: otherEmail,
        reveiverId: myEmail,
      })
    );

    setMessages((prev) =>
      prev.map((msg) =>
        msg.receiverId === myEmail && msg.unread
          ? { ...msg, unread: false }
          : msg
      )
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4">
      <div
        className="flex-grow overflow-auto bg-gray-100 p-4 rounded-lg shadow-md"
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            notifyReadMessages();
          }
        }}
      >
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === myEmail;
          return (
            <div
              key={idx}
              className={`w-full flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`my-2 p-2 rounded-md max-w-[70%] break-words ${
                  isMine ? "bg-blue-200 text-right" : "bg-white text-left"
                }`}
              >
                <div>{msg.content}</div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {msg.unread ? "읽지 않음" : "읽음"}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-2">
        <input
          className="flex-grow border border-gray-300 rounded-l px-2 py-1"
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded-r"
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
}
