"use client";

import { useEffect, useRef } from "react";
import { Room } from "livekit-client";
import { useParams } from "next/navigation";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

export default function SenderPage() {
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
    <div>
      <h1>Sender - Room {roomId}</h1>
      <p>카메라와 마이크가 자동으로 방송됩니다.</p>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "400px",
          borderRadius: "8px",
          border: "2px solid #ccc",
        }}
      />
    </div>
  );
}
