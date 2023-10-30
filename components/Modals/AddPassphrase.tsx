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
import { encryptMessage } from "@/lib/nostr";

export default function AddPassphrase({ nsec }: { nsec: string }) {
  const { signer } = useNDK();
  const { currentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [passphrase, setPassphrase] = useState("");

  const modal = useModal();

  useEffect(() => {
    if (currentUser) {
      console.log("Current signer", currentUser.ndk?.signer);
      console.log("Current signer alt", signer);
    }
  }, [currentUser]);

  async function handleAddPassphrase() {
    setIsLoading(true);
    console.log("loging in");
    const encryptedNsec = encryptMessage(nsec, passphrase);
    if (encryptedNsec) {
      localStorage.setItem("encrypted-nsec", encryptedNsec);
    }
    setIsLoading(false);
    modal?.hide();
  }

  return (
    <Template title="Login" className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <div className="">
          <p className="text-sm text-muted-foreground">
            Wan't to make it easier to log in next time? Add a passphrase that
            we'll use to encrypt and save your nsec.
          </p>
        </div>
        <div className="space-y-3">
          <Label>Passphrase</Label>
          <Input
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="passphrase..."
            type="password"
            className="text-[16px]"
          />
          <Button
            variant={"outline"}
            onClick={() => void handleAddPassphrase()}
            loading={isLoading}
            className="w-full"
          >
            Save passphrase
          </Button>
        </div>
      </div>
    </Template>
  );
}
