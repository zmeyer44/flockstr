"use client";
import { Button } from "@/components/ui/button";
import {
  HiOutlineHandThumbUp,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import { HiOutlineLightningBolt } from "react-icons/hi";

export default function Actions() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button size={"sm"} variant={"outline"} className="gap-x-1.5">
          <HiOutlineHandThumbUp className="h-4 w-4" />
        </Button>
        <Button size={"sm"} variant={"outline"} className="gap-x-1.5">
          <HiOutlineChatBubbleLeftEllipsis className="h-4 w-4" />
        </Button>
        <Button size={"sm"} className="gap-x-1.5">
          <HiOutlineLightningBolt className="h-4 w-4" />
          <span>zap</span>
        </Button>
      </div>
    </div>
  );
}
