"use client";

import { Toaster } from "sonner";
import { ModalProvider } from "./modal/provider";
import useRouteChange from "@/lib/hooks/useRouteChange";
import { NDKProvider } from "./ndk";
import { RELAYS } from "@/constants";

export function Providers({ children }: { children: React.ReactNode }) {
  const handleRouteChange = (url: string) => {
    const RichHistory = sessionStorage.getItem("RichHistory");
    if (!RichHistory) {
      sessionStorage.setItem("RichHistory", "true");
    }
  };
  useRouteChange(handleRouteChange);
  return (
    <>
      <NDKProvider
        relayUrls={RELAYS}
      >
        
      <Toaster richColors className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <ModalProvider>{children}</ModalProvider>
      </NDKProvider>
    </>
  );
}
