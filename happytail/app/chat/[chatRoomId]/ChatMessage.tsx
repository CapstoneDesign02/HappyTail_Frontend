import React from "react";
import Image from "next/image";

interface ChatMessageProps {
  time: string;
  imageUrl?: string;
  text: string;
  isUser: boolean;
  unread: boolean;
}

const ChatMessage = ({
  time,
  imageUrl,
  text,
  isUser,
  unread,
}: ChatMessageProps) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`px-4 py-2 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser ? (
        <div className="flex items-end min-w-8 gap-1 flex-row-reverse">
          {imageUrl && (
            <div className="w-8 h-8 mr-1 shrink-0 relative">
              <Image
                src={imageUrl}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover w-8 h-8"
              />
            </div>
          )}

          <div className="flex flex-col items-end">
            <div
              className={`inline-block p-3 rounded-2xl ${
                isUser
                  ? "bg-amber-400 text-white rounded-tr-none"
                  : "bg-gray-100 text-black rounded-tl-none"
              } `}
            >
              {text}
            </div>

            <span className="text-[12px] text-gray-400 mt-1">
              {formatTime(time)} {unread ? "읽지 않음" : "읽음"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-1">
          {imageUrl && (
            <div className="relative w-8 h-8 mr-1 shrink-0">
              <Image
                src={imageUrl}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col items-start">
            <div
              className={`inline-block p-3 rounded-2xl ${
                isUser
                  ? "bg-amber-400 text-white rounded-tr-none"
                  : "bg-gray-100 text-black rounded-tl-none"
              } w-auto `}
            >
              {text}
            </div>

            <span className="text-[12px] text-gray-400 mt-1">
              {formatTime(time)} {unread ? "읽지 않음" : "읽음"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
