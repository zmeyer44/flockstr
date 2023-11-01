"use client";

import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import Logo from "@/assets/Logo";
import InstallPWAModal from "@/components/Modals/PWAInstall";
import { useModal } from "@/app/_providers/modal/provider";

export default function MobileBanner() {
  const modal = useModal();
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [hidePWA, setHidePWA] = useLocalStorage<boolean | undefined>(
    "hidePWA",
    undefined,
  );
  useEffect(() => {
    if (!hidePWA) {
      setShowPWAPrompt(true);
    }
  }, []);

  function handleClickHide() {
    setHidePWA(true);
    setShowPWAPrompt(false);
  }
  function handleShowModal() {
    modal?.show(<InstallPWAModal />);
  }
  if (!showPWAPrompt) return null;
  return (
    <div className="standalone-hide fixed bottom-[var(--bottom-nav-height)] flex w-screen items-center gap-3 border-t bg-card px-3 py-2.5 sm:hidden">
      <div className="center h-[32px] w-[32px] shrink-0 rounded-[6px] border bg-white shadow">
        <Logo className="h-[20px] w-[20px] text-primary" />
      </div>
      <div className="flex-1 text-sm font-medium text-foreground">
        Get our PWA
      </div>
      <Button onClick={handleShowModal} size={"sm"} className="rounded-[6px]">
        Install
      </Button>
      <button onClick={handleClickHide} className="center -mx-1">
        <RiCloseFill className="h-[18px] w-[18px] text-muted-foreground" />
      </button>
    </div>
  );
}
