"use client";

import { useEffect, useState } from "react";
import { Room } from "livekit-client";
import { useParams } from "next/navigation";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

export default function SenderPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const room = new Room();

    async function connectRoom() {
      try {
        const identity = `sender-${roomId}-1`;
        console.log("Connecting as identity:", identity);
        console.log("Connecting to room:", roomId);
        const res = await fetch(
          `/api/token?identity=${identity}&roomName=${roomId}`
        );
        const data = await res.json();
        console.log("Received token:", data.token);

        if (!data.token) throw new Error("토큰 발급 실패");

        await room.connect(LIVEKIT_URL, data.token);

        // 내 카메라, 마이크 트랙 얻기
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const tracks = stream.getTracks();

        // 로컬 트랙 퍼블리시
        // 기존: await room.localParticipant.publishTracks(tracks);

        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
        }

        setRoom(room);
      } catch (e: any) {
        setError(e.message);
      }
    }

    connectRoom();

    // 컴포넌트 언마운트 시 disconnect
    return () => {
      room.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h1>Sender - Room {roomId}</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <p>카메라와 마이크가 자동으로 방송됩니다.</p>
    </div>
  );
}
