"use client";

import { Button } from "@/components/ui/button";
import {
  HiOutlineHandThumbUp,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import { HiOutlineLightningBolt } from "react-icons/hi";
import ZapPicker from "@/components/Modals/ZapPicker";
import { useModal } from "@/app/_providers/modal/provider";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { stopPropagation } from "@/lib/utils";

type ActionProps = {
  event: NostrEvent;
};
export default function Actions({ event }: ActionProps) {
  const modal = useModal();
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button size={"sm"} variant={"ghost"} className="gap-x-1.5 px-2">
            <HiOutlineHandThumbUp className="h-4 w-4" />
          </Button>
          <Button size={"sm"} variant={"ghost"} className="gap-x-1.5 px-2">
            <HiOutlineChatBubbleLeftEllipsis className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={(e) => {
            stopPropagation(e);
            console.log("captured");
            modal?.show(<ZapPicker event={event} />);
          }}
          size={"sm"}
          className="gap-x-1.5"
        >
          <HiOutlineLightningBolt className="h-4 w-4" />
          <span>zap</span>
        </Button>
      </div>
    </div>
  );
}
