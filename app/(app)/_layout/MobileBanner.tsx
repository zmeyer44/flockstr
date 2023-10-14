"use client";

import { useEffect, useState } from "react";
import { RiCloseFill, RiLeafFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/lib/hooks/useLocalStorage";

export default function MobileBanner() {
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
  if (!showPWAPrompt) return null;
  return (
    <div className="fixed bottom-[var(--bottom-nav-height)] flex w-screen items-center gap-3 border-t bg-card px-3 py-2.5 sm:hidden">
      <div className="center h-[32px] w-[32px] shrink-0 rounded-[6px] border bg-white shadow">
        <RiLeafFill className="text-black" />
      </div>
      <div className="flex-1 text-sm font-medium text-foreground">
        Get our PWA
      </div>
      <Button size={"sm"} className="rounded-[6px]">
        Install
      </Button>
      <button onClick={handleClickHide} className="center -mx-1">
        <RiCloseFill className="h-[18px] w-[18px] text-muted-foreground" />
      </button>
    </div>
  );
}
