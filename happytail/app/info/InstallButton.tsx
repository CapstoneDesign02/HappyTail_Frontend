"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("이미 다운로드 된 앱입니다.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA 설치 완료");
    } else {
      console.log("PWA 설치 거부");
    }
    setDeferredPrompt(null);
  };

  return (
    <button
      className="mt-6 md:mt-8 w-full max-w-[400px] h-12 sm:h-14 md:h-16 justify-start relative"
      onClick={handleInstallPWA}
    >
      <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-md"></div>
      <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center">
        <div className="text-black text-opacity-80 text-lg sm:text-xl md:text-2xl font-bold font-['NanumSquareRound']">
          앱 다운로드
        </div>
      </div>
    </button>
  );
};

export default InstallPWAButton;
