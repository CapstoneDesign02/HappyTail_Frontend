import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // react-router-dom을 이용해 채팅방 페이지로 이동

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  unreadMessages: number;
}

export default function ChatRoomList() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    // 채팅방 목록을 가져오는 API 호출 (예시)
    fetch("/api/chat/rooms")
      .then((res) => res.json())
      .then((data) => setChatRooms(data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">채팅방 목록</h2>
      <ul className="mt-4 space-y-4">
        {chatRooms.map((room) => (
          <li
            key={room.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <div>
              <h3 className="font-medium text-lg">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.lastMessage}</p>
            </div>
            <div className="flex items-center">
              {room.unreadMessages > 0 && (
                <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full">
                  {room.unreadMessages}
                </span>
              )}
              <Link
                to={`/chat/${room.id}`}
                className="ml-4 text-blue-500 hover:underline"
              >
                채팅하기
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
