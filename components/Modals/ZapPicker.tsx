"use client";
import { useState, useRef, useEffect } from "react";
import Template from "./Template";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import { toast } from "sonner";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiSubtractFill, RiAddFill } from "react-icons/ri";
import { formatCount } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type NostrEvent } from "@nostr-dev-kit/ndk";
import { sendZap } from "@/lib/actions/zap";

const intervals = [
  10, 25, 50, 75, 100, 150, 200, 250, 350, 500, 750, 1000, 1250, 1500, 2_000,
  2_500, 3_000, 3_500, 4_000, 5_000, 6_000, 7_500, 10_000, 12_500, 15_000,
  20_000, 25_000, 30_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000,
  300_000, 500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000,
];

type ZapPickerProps = {
  event: NostrEvent;
};
export default function ZapPicker({ event }: ZapPickerProps) {
  const { loginWithNip07 } = useNDK();
  const { loginWithPubkey, currentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const modal = useModal();
  const [sats, setSats] = useState(2000);
  const { ndk } = useNDK();

  function onClick(type: "+" | "-") {
    setSats((prev) => {
      let index = intervals.findIndex((i) => prev === i);
      if (type === "+") {
        index++;
      } else {
        index--;
      }

      return intervals.at(index) ?? 2000;
    });
  }

  async function handleSendZap() {
    try {
      setIsLoading(true);
      const result = await sendZap(ndk!, sats, event, note);
      toast.success("Zap Sent!");
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Template title="Send Zap!" className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <div className="pb-2">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => onClick("-")}
              disabled={sats <= 10}
            >
              <RiSubtractFill className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="text-5xl font-bold tracking-tighter">
                {formatCount(sats)}
              </div>
              <div className="text-[0.70rem] uppercase text-muted-foreground">
                Satoshis
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => onClick("+")}
              disabled={sats >= 2_000_000}
            >
              <RiAddFill className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <div className="pt-3">
            <Label>Note</Label>
            <Textarea
              placeholder="Add a note..."
              onChange={(e) => setNote(e.target.value)}
              value={note}
              className="auto-sizing"
            />
          </div>
        </div>

        <Button
          onClick={handleSendZap}
          loading={isLoading}
          className="w-full gap-x-1"
        >
          <span>Send Zap</span>
          <HiOutlineLightningBolt className="h-4 w-4" />
        </Button>
      </div>
    </Template>
  );
}
