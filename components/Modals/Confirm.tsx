"use client";
import { useState, type ReactNode } from "react";
import Template from "./Template";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import { nip19 } from "nostr-tools";
// import { useKeys } from "@/app/_providers/keysProvider";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiSubtractFill, RiAddFill } from "react-icons/ri";
import { formatCount } from "@/lib/utils";

type ConfirmModalProps = {
  title?: string;
  children: ReactNode;
  ctaBody?: ReactNode;
  onConfirm: () => Promise<void>;
};

export default function ConfirmModal({
  title = "Confirm",
  children,
  ctaBody = "Confirm",
  onConfirm,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      console.log("Error", err);
    } finally {
      setIsLoading(false);
      modal?.hide();
    }
  }

  return (
    <Template title={title} className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <div className="pb-2">{children}</div>
        <Button
          onClick={() => void handleSubmit()}
          loading={isLoading}
          className="w-full gap-x-1"
        >
          {ctaBody}
        </Button>
      </div>
    </Template>
  );
}
