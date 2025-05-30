"use client";

import { useEffect, useRef } from "react";
import { Room } from "livekit-client";
import { useParams, useRouter } from "next/navigation";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

export default function SenderPage() {
  const router = useRouter();
  const { roomId } = useParams<{ roomId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const room = new Room();

    async function connectRoom() {
      try {
        const identity = `sender-${roomId}-1`;
        const res = await fetch(
          `/api/token?identity=${identity}&roomName=${roomId}`
        );
        const data = await res.json();

        if (!data.token) throw new Error("토큰 발급 실패");

        await room.connect(LIVEKIT_URL, data.token);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const tracks = stream.getTracks();
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
        }
      } catch (e) {
        console.error("Error connecting to room:", e);
      }
    }

    connectRoom();

    return () => {
      room.disconnect();
    };
  }, [roomId]);

  return (
    <div className="relative overflow-x-hidden flex flex-col items-center min-h-screen font-bold text-black bg-white pb-24 px-4 w-[80%] w-min-[400px]  mx-auto font-['NanumSquareRound']">
      <div className="w-full flex items-center justify-between py-3">
        <div className="flex items-center">
          <button onClick={() => router.push("/reservation")}>
            <div className="w-12 h-12 flex items-center justify-center mr-4">
              <span className="text-3xl font-extrabold">{"<"}</span>
            </div>
          </button>
          <h1 className="text-2xl font-extrabold">반려동물 홈캠</h1>
        </div>
      </div>
      <div className="w-full h-px bg-yellow-400 mb-6"></div>{" "}
      <p>카메라와 마이크가 자동으로 방송됩니다.</p>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "1200px", height: "700px", backgroundColor: "#000" }}
      />
    </div>
  );
}
