"use client";

import React, { useEffect, useState } from "react";
import { Room, RemoteVideoTrack, RemoteAudioTrack } from "livekit-client";
import { useParams } from "next/navigation";

export default function Viewer() {
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

        await room.connect(`${process.env.NEXT_PUBLIC_LIVEKIT_URL}`, data.token, {
          autoSubscribe: true,
        });

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
        console.error("Error connecting to room:", e);}
    }
    start();

    return () => {
      room?.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h1>Viewer (Room: {roomId})</h1>
      <video
        id="remote-video"
        autoPlay
        playsInline
        style={{ width: "480px", height: "360px", backgroundColor: "#000" }}
      />
      <audio id="remote-audio" autoPlay />
    </div>
  );
}
