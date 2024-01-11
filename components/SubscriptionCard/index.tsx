import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, log } from "@/lib/utils";
import { NDKEvent, NDKUser, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { toast } from "sonner";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { sendZap, checkPayment } from "@/lib/actions/zap";
import { btcToSats, formatNumber } from "@/lib/utils";
import { BANNER } from "@/constants";
import { follow } from "@/lib/actions/create";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { formatDate } from "@/lib/utils/dates";
import { useModal } from "@/app/_providers/modal/provider";

const ConfirmModal = dynamic(() => import("@/components/Modals/Confirm"), {
  ssr: false,
});

export default function SubscriptionCard({ event }: { event: NDKEvent }) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const modal = useModal();
  const [subscribing, setSubscribing] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const { tags } = event;
  const rawEvent = event.rawEvent();
  const title = getTagValues("title", tags) ?? getTagValues("name", tags) ?? "";
  const image = getTagValues("image", tags) ?? BANNER;
  const description =  event.content ?? "";
  const delegate = getTagValues("delegate", tags);
  const priceInBTC = parseFloat(getTagValues("price", rawEvent.tags) ?? "0");

  async function handleSubscribe() {
    log("func", "handleSubscribe");
    setSubscribing(true);
    try {
      if (!currentUser || !ndk?.signer) return;
      if (delegate) {
        await follow(ndk, currentUser, delegate);
        log("info", "followed");
      }
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
      setSubscribing(false);
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
  useEffect(() => {
    if (!currentUser) return;
    if (!checkingPayment && !hasValidPayment) {
      void handleCheckPayment();
    }
  }, [currentUser]);
  return (
    <Card className="group sm:flex sm:items-stretch">
      <div className="max-h-full overflow-hidden max-sm:h-[100px] max-sm:rounded-t-md sm:w-[250px] sm:rounded-l-md">
        <Image
          width={250}
          height={150}
          src={image}
          alt={title}
          unoptimized
          className={cn(
            "h-full w-full object-cover object-center transition-all group-hover:scale-105 sm:h-full sm:w-auto",
          )}
        />
      </div>
      <div className="h-full flex-1">
        <CardHeader className="">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="items-strech mt-auto flex w-full flex-col items-center gap-2 sm:max-w-md sm:flex-row sm:gap-4">
          {hasValidPayment ? (
            <Button disabled={true} variant={"ghost"} className="w-full">
              Pending sync
            </Button>
          ) : (
            <>
              <Button
                loading={subscribing}
                onClick={() =>
                  modal?.show(
                    <ConfirmModal
                      title={`Subscribe to ${title}`}
                      onConfirm={handleSubscribe}
                      ctaBody={
                        <>
                          <span>Zap to Subscribe</span>
                          <HiOutlineLightningBolt className="h-4 w-4" />
                        </>
                      }
                    >
                      <p className="text-muted-forground">
                        {`Pay ${priceInBTC} BTC (${formatNumber(
                          btcToSats(priceInBTC),
                        )} sats) for year long access until ${formatDate(
                          new Date(
                            new Date().setFullYear(
                              new Date().getFullYear() + 1,
                            ),
                          ),
                          "MMM Do, YYYY",
                        )}`}
                      </p>
                    </ConfirmModal>,
                  )
                }
                className="w-full"
              >
                Subscribe
              </Button>

              <Link href={`/sub/${event.encode()}`} className="w-full">
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
