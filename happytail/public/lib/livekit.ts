import { AccessToken, VideoGrant } from 'livekit-server-sdk';

export function createAccessToken(identity: string, roomName: string, canPublish: boolean) {
  const at = new AccessToken(
    process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
    process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!,
    { identity }
  );

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe: true,
  };

  at.addGrant(grant);
  return at.toJwt();
}
