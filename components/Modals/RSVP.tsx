"use client";
import { useState } from "react";
import Template from "./Template";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useModal } from "@/app/_providers/modal/provider";
import { randomId } from "@/lib/nostr";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
// import { useKeys } from "@/app/_providers/keysProvider";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { createEvent } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndk";
import useAuthGuard from "./hooks/useAuthGuard";
type RSVPModalProps = {
  eventReference: string;
};

const statusMap = {
  accept: "accepted",
  maybe: "tentative",
  decline: "declined",
};

export default function RSVPModal({ eventReference }: RSVPModalProps) {
  useAuthGuard();
  const modal = useModal();
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = useState({
    accept: false,
    maybe: false,
    decline: false,
  });

  async function handleRSVP(type: "accept" | "maybe" | "decline") {
    if (!ndk || !currentUser) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const random = randomId();
      const tags: string[][] = [
        ["d", random],
        ["a", eventReference],
        ["L", "status"],
        ["l", statusMap[type], "status"],
      ];
      const event = await createEvent(ndk, {
        content: "",
        kind: 31925,
        tags,
      });
      if (event) {
        toast.success("Event Created!");
        modal?.hide();
      } else {
        toast.error("An error occured");
      }
    } catch (err) {
      console.log("Err", err);
    } finally {
      setLoading({ accept: false, maybe: false, decline: false });
    }
  }
  return (
    <Template title="RSVP to Event" className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <Button
          loading={loading.accept}
          onClick={() => handleRSVP("accept")}
          className="w-full gap-x-1"
        >
          <span>Accept</span>
        </Button>
        <Button
          loading={loading.maybe}
          onClick={() => handleRSVP("maybe")}
          variant={"outline"}
          className="w-full gap-x-1"
        >
          <span>Maybe</span>
        </Button>
        <Button
          loading={loading.decline}
          onClick={() => handleRSVP("decline")}
          variant={"destructive"}
          className="w-full gap-x-1"
        >
          <span>Decline</span>
        </Button>
      </div>
    </Template>
  );
}
