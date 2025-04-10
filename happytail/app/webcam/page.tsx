import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:5000";
const DEFAULT_ROOM_ID = "cctv-stream";

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [peers, setPeers] = useState<string[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<string>("대기 중");
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize socket connection
  useEffect(() => {
    console.log("소켓 연결 시도 중...");
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("서버에 연결됨:", newSocket.id);
    });

    newSocket.on("new-peer", ({ peerId }: { peerId: string }) => {
      console.log("새 피어 참가:", peerId);
      setPeers((prevPeers) => [...prevPeers, peerId]);
    });

    newSocket.on("peer-left", ({ peerId }: { peerId: string }) => {
      console.log("피어 퇴장:", peerId);
      setPeers((prevPeers) => prevPeers.filter((id) => id !== peerId));
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      newSocket.close();
    };
  }, []);

  // Effect to handle video stream when ref is available
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log("비디오 요소에 스트림 연결 중...");
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const joinRoom = async () => {
    if (!socket) {
      console.error("소켓이 연결되지 않았습니다.");
      return;
    }
    
    try {
      console.log("방 참가 시도 중...");
      
      socket.emit(
        "join-room",
        { roomId: DEFAULT_ROOM_ID, peerId: socket.id },
        (response: { error?: string }) => {
          if (response?.error) {
            console.error("방 참가 오류:", response.error);
            return;
          }
          setJoined(true);
          console.log("방 참가 성공!");
        }
      );
    } catch (error) {
      console.error("방 참가 실패:", error);
    }
  };

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log("사용 가능한 비디오 장치:", videoDevices.length);
      return videoDevices.length > 0;
    } catch (error) {
      console.error("장치 확인 오류:", error);
      return false;
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setCameraStatus("카메라 접근 시도 중...");
      console.log("카메라 접근 시도 중...");
      
      // 카메라 사용 가능 여부 확인
      const hasCameras = await checkCameraAvailability();
      if (!hasCameras) {
        throw new Error("사용 가능한 카메라가 없습니다.");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      
      console.log("카메라 접근 성공!");
      setCameraStatus("카메라 연결됨");
      setLocalStream(stream);
      
      // 카메라 연결 후 방 참가
      if (!joined && socket) {
        joinRoom();
      }
      
      return stream;
    } catch (error: any) {
      console.error("카메라 접근 오류:", error);
      setCameraError(error.message || "카메라에 접근할 수 없습니다.");
      setCameraStatus("카메라 오류");
      
      // 브라우저가 NotAllowedError를 반환하면 사용자가 권한을 거부한 것
      if (error.name === "NotAllowedError") {
        setCameraError("카메라 액세스 권한이 거부되었습니다. 브라우저 설정에서 권한을 확인하세요.");
      }
      // 브라우저가 NotFoundError를 반환하면 카메라를 찾을 수 없음
      else if (error.name === "NotFoundError") {
        setCameraError("카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인하세요.");
      }
      throw error;
    }
  };

  const retryCamera = async () => {
    try {
      await startCamera();
    } catch (error) {
      // Already handled in startCamera
    }
  };

  const checkBrowserSupport = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-black px-4">
      {/* 헤더 */}
      <div className="w-full max-w-xl flex flex-col items-center justify-center text-center">
        <div className="w-full flex items-center justify-center py-6">
          <button className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center shadow-md">
              <span className="text-3xl font-extrabold font-['NanumSquareRound']">{"<"}</span>
            </div>
          </button>
          <h1 className="text-2xl font-extrabold font-['NanumSquareRound']">실시간 홈캠 영상</h1>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full max-w-4xl h-px bg-yellow-400 my-6"></div>

      {/* 카메라 상태 정보 */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-4">
        <p className="text-gray-600">카메라 상태: {cameraStatus}</p>
        {!checkBrowserSupport() && (
          <div className="bg-red-100 p-2 rounded mt-2 text-red-700">
            이 브라우저는 카메라 API를 지원하지 않습니다.
          </div>
        )}
      </div>

      {/* 비디오 스트리밍 화면 */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center">
        {/* 수동 카메라 시작 버튼 */}
        {!localStream && (
          <button 
            onClick={startCamera}
            className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md"
          >
            카메라 시작하기
          </button>
        )}

        {cameraError ? (
          <div className="w-full flex flex-col items-center gap-4 p-6 bg-red-50 border border-red-300 rounded">
            <p className="text-red-600">카메라 오류: {cameraError}</p>
            <button 
              onClick={retryCamera} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              카메라 재연결 시도
            </button>
          </div>
        ) : (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-[1080px] h-auto bg-gray-200 border border-gray-300"
          ></video>
        )}
        
        {/* 소켓 연결 상태 */}
        <div className="mt-4">
          {!socket ? (
            <div className="p-2 bg-yellow-100 text-yellow-700 rounded">
              서버에 연결 중...
            </div>
          ) : joined ? (
            <div className="p-2 bg-green-100 text-green-700 rounded">
              방에 연결됨: {DEFAULT_ROOM_ID} (피어: {peers.length})
            </div>
          ) : (
            <button 
              onClick={joinRoom}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={!localStream}
            >
              방 참가하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;