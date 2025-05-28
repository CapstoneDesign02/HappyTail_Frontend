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
            <div className="relative min-w-8 w-8 h-8 ml-1 shrink-0">
              <Image
                src={imageUrl}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col items-end">
            <div
              className={`inline-block p-3 rounded-2xl ${
                isUser
                  ? "bg-amber-400 text-white rounded-tr-none"
                  : "bg-gray-100 text-black rounded-tl-none"
              } w-fitmin-w-[6rem] max-w-[80%] whitespace-pre-wrap break-words`}
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
              } w-auto min-w-[6rem] max-w-[60%] whitespace-pre-wrap break-words`}
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
