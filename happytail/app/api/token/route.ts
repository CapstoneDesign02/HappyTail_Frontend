// app/api/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AccessToken, VideoGrant } from "livekit-server-sdk";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const identity = searchParams.get("identity");
  const roomName = searchParams.get("roomName");

  if (!identity || !roomName) {
    return NextResponse.json(
      { error: "identity and roomName required" },
      { status: 400 }
    );
  }

  const at = new AccessToken(
    process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
    process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!,
    { identity }
  );


  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  const token = await at.toJwt();
  console.log("Generated token:", token);
  console.log(typeof token);

  return NextResponse.json({ token });
}
