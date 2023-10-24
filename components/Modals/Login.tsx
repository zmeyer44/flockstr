"use client";
import { useState, useRef, useEffect } from "react";
import Template from "./Template";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import { nip19 } from "nostr-tools";
// import { useKeys } from "@/app/_providers/keysProvider";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginModal() {
  const { loginWithNip07, loginWithSecret } = useNDK();
  const { loginWithPubkey, currentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [nsec, setNsec] = useState("");
  const modal = useModal();

  useEffect(() => {
    const shouldReconnect = localStorage.getItem("shouldReconnect");

    const getConnected = async (shouldReconnect: string) => {
      let enabled: boolean | void = false;

      if (typeof window.nostr === "undefined") {
        return;
      }

      if (shouldReconnect === "true") {
        const user = await loginWithNip07();
        if (!user) {
          throw new Error("NO auth");
        }
        await loginWithPubkey(nip19.decode(user.npub).data.toString());
        // keys?.setKeys({
        //   privkey: "",
        //   pubkey: ,
        // });
      }

      if (typeof window.webln === "undefined") {
        return;
      }

      if (shouldReconnect === "true" && !window.webln.executing) {
        try {
          enabled = await window.webln.enable();
        } catch (e: any) {
          console.log(e.message);
        }
      }
      return enabled;
    };

    if (shouldReconnect === "true") {
      getConnected(shouldReconnect);
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      modal?.hide();
    }
  }, [currentUser]);

  async function handleLogin() {
    setIsLoading(true);
    if (typeof window.nostr !== "undefined") {
      const user = await loginWithNip07();
      if (!user) {
        throw new Error("NO auth");
      }
      console.log("LOGIN", user);
      await loginWithPubkey(nip19.decode(user.npub).data.toString());
      localStorage.setItem("shouldReconnect", "true");
    }

    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
    }
    console.log("connected ");
    setIsLoading(false);
    modal?.hide();
  }
  async function handleLoginNsec() {
    setIsLoading(true);
    console.log("loging in");

    const user = await loginWithSecret(nsec);
    if (!user) {
      throw new Error("NO auth");
    }
    console.log("LOGIN", user);
    await loginWithPubkey(nip19.decode(user.npub).data.toString());
    localStorage.setItem("shouldReconnect", "true");

    if (typeof window.webln !== "undefined") {
      await window.webln.enable();
    }
    console.log("connected ");
    setIsLoading(false);
    modal?.hide();
  }

  return (
    <Template title="Login" className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <Button onClick={() => void handleLogin()} loading={isLoading}>
          Connect with extension
        </Button>
        <div className="space-y-3">
          <Label>Nsec</Label>
          <Input
            value={nsec}
            onChange={(e) => setNsec(e.target.value)}
            placeholder="nsec..."
            className="text-[16px]"
          />
          <Button
            variant={"outline"}
            onClick={() => void handleLoginNsec()}
            loading={isLoading}
            className="w-full"
          >
            Connect with Nsec
          </Button>
        </div>
      </div>
    </Template>
  );
}
