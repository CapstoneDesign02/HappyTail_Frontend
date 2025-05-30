"use client";

import React, { useEffect, useState } from "react";
import { Room, RemoteVideoTrack, RemoteAudioTrack } from "livekit-client";
import { useParams, useRouter } from "next/navigation";

export default function Viewer() {
  const router = useRouter();
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    async function start() {
      try {
        const identity = `viewer-${roomId}-1`;

        const res = await fetch(
          `/api/token?identity=${identity}&roomName=${roomId}`
        );
        const data = await res.json();
        console.log("Received token:", data.token);

        const room = new Room();

        await room.connect(
          `${process.env.NEXT_PUBLIC_LIVEKIT_URL}`,
          data.token,
          {
            autoSubscribe: true,
          }
        );

        room.on("trackSubscribed", (track) => {
          if (track.kind === "video") {
            const videoTrack = track as RemoteVideoTrack;
            const videoElement = document.getElementById(
              "remote-video"
            ) as HTMLVideoElement | null;
            if (videoElement) {
              videoTrack.attach(videoElement);
            }
          } else if (track.kind === "audio") {
            const audioTrack = track as RemoteAudioTrack;
            const audioElement = document.getElementById(
              "remote-audio"
            ) as HTMLAudioElement | null;
            if (audioElement) {
              audioTrack.attach(audioElement);
            }
          }
        });

        setRoom(room);
      } catch (e) {
        console.error("Error connecting to room:", e);
      }
    }
    start();

    return () => {
      room?.disconnect();
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
      <video
        id="remote-video"
        autoPlay
        playsInline
        style={{ width: "1200px", height: "700px", backgroundColor: "#000" }}
      />
      <audio id="remote-audio" autoPlay />
    </div>
  );
}
