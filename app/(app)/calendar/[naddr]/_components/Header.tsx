"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import useProfile from "@/lib/hooks/useProfile";
import Spinner from "@/components/spinner";
import {
  getTagAllValues,
  getTagValues,
  getTagsValues,
} from "@/lib/nostr/utils";
import ProfileInfo from "./ProfileInfo";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { toast } from "sonner";
import {
  sendZap,
  checkPayment,
  updateListUsersFromZaps,
} from "@/lib/actions/zap";
import { type NDKEvent } from "@nostr-dev-kit/ndk";
import { btcToSats, formatNumber } from "@/lib/utils";
import BannerImage from "@/components/PageComponents/BannerImage";

const CreateEventButton = dynamic(() => import("./CreateEventButton"), {
  ssr: false,
});
const EditCalendarButton = dynamic(() => import("./EditCalendarButton"), {
  ssr: false,
});

export default function Header({ event }: { event: NDKEvent }) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const { pubkey, tags } = event;
  const { profile } = useProfile(pubkey);
  const identifier = event.tagId();
  const name = getTagValues("name", tags) ?? "Untitled";
  const image =
    getTagValues("banner", tags) ??
    getTagValues("image", tags) ??
    getTagValues("picture", tags) ??
    profile?.banner;

  const description = event.content;

  const rawEvent = event.rawEvent();
  const priceInBTC = parseFloat(getTagValues("price", rawEvent.tags) ?? "0");
  const isMember =
    currentUser &&
    getTagsValues("p", rawEvent.tags).includes(currentUser.pubkey);

  useEffect(() => {
    if (!currentUser || !false) return;
    if (!isMember && !checkingPayment && !hasValidPayment) {
      void handleCheckPayment();
    }
  }, [isMember, currentUser]);

  async function handleCheckPayment() {
    if (!event || !currentUser || !ndk) return;
    setCheckingPayment(true);
    console.log("Checking payment");
    try {
      const result = await checkPayment(
        ndk,
        event.tagId(),
        currentUser.pubkey,
        rawEvent,
      );
      console.log("Payment result", result);
      if (result) {
        setHasValidPayment(true);
      }
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setCheckingPayment(false);
    }
  }

  async function handleSendZap() {
    try {
      const result = await sendZap(
        ndk!,
        btcToSats(priceInBTC),
        rawEvent,
        `Access payment: ${name}`,
      );
      toast.success("Payment Sent!");
      void handleCheckPayment();
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
    }
  }
  if (!event) {
    return (
      <div className="center pt-20 text-primary">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem] @container">
      <div className="overflow-hidden rounded-[0.5rem] p-0">
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary pb-[50%] @5xl:rounded-[20px] md:pb-[40%]">
          {!!image && <BannerImage image={image} />}
        </div>
      </div>
      <div className="space-y-1 p-3 @sm:px-3.5 @sm:pb-2 @sm:pt-5">
        <div className="flex items-start justify-between gap-x-1.5 @lg:gap-x-2.5 ">
          <div className="space-y-1 @sm:space-y-2">
            <h2 className="font-condensed text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {name}
            </h2>
            <div className="flex items-center">
              <ProfileInfo pubkey={pubkey} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {!!currentUser && currentUser.pubkey === pubkey && (
              <>
                <CreateEventButton eventIdentifier={identifier} />
                <EditCalendarButton event={event.rawEvent()} />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-x-6 gap-y-3 pt-1 @md:pt-2 @xl:flex-row">
          <div className="flex-2">
            {!!description && (
              <p className="text-sm text-muted-foreground @md:text-sm">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-1 @xl:justify-end">
            <div className="flex flex-col gap-3 pr-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
