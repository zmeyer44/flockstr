import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NDKEvent, NDKUser, NostrEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { toast } from "sonner";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { sendZap, checkPayment } from "@/lib/actions/zap";
import { btcToSats, formatNumber } from "@/lib/utils";

export default function SubscriptionCard({ event }: { event: NDKEvent }) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const { tags } = event;
  const rawEvent = event.rawEvent();
  const title = getTagValues("title", tags) ?? getTagValues("name", tags) ?? "";
  const image =
    getTagValues("image", tags) ?? getTagValues("picture", tags) ?? "";
  const description =
    getTagValues("description", tags) ?? getTagValues("summary", tags) ?? "";
  const delegate = getTagValues("delegate", tags);
  const priceInBTC = parseFloat(getTagValues("price", rawEvent.tags) ?? "0");

  async function handleSubscribe() {
    try {
      if (!currentUser) return;
      await currentUser.follow(
        new NDKUser({
          hexpubkey: delegate,
        }),
      );
      const result = await sendZap(
        ndk!,
        btcToSats(priceInBTC),
        rawEvent,
        `Access payment: ${title}`,
      );
      toast.success("Payment Sent!");
      void handleCheckPayment();
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
    }
  }

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
  return (
    <Card className="group sm:flex">
      <div className="overflow-hidden max-sm:h-[100px] max-sm:rounded-t-md sm:w-[250px] sm:rounded-l-md">
        <Image
          width={250}
          height={150}
          src={image}
          alt={title}
          unoptimized
          className={cn(
            "w-auto object-cover object-center transition-all group-hover:scale-105 sm:h-full",
          )}
        />
      </div>
      <div className="">
        <CardHeader className="">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="items-strech flex w-full flex-col items-center gap-2 sm:max-w-md sm:flex-row sm:gap-4">
          {hasValidPayment ? (
            <Button disabled={true} variant={"ghost"} className="w-full">
              Pending sync
            </Button>
          ) : (
            <>
              <Button
                loading={checkingPayment}
                onClick={handleSubscribe}
                className="w-full"
              >
                Join now
              </Button>
              <Link href={`/sub/${event.encode()}`}>
                <Button variant={"secondary"} className="w-full">
                  Details
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
