"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import useProfile from "@/lib/hooks/useProfile";
import { HiOutlineLightningBolt } from "react-icons/hi";
import Spinner from "@/components/spinner";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import ProfileInfo from "./ProfileInfo";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { toast } from "sonner";
import {
  sendZap,
  checkPayment,
  updateListUsersFromZaps,
} from "@/lib/actions/zap";
import { useModal } from "@/app/_providers/modal/provider";
import { type NDKEvent } from "@nostr-dev-kit/ndk";
import { btcToSats, formatNumber } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates";
import { follow } from "@/lib/actions/create";
import { log } from "@/lib/utils";

const CreateEventModal = dynamic(() => import("@/components/Modals/NewEvent"), {
  ssr: false,
});
const ConfirmModal = dynamic(() => import("@/components/Modals/Confirm"), {
  ssr: false,
});

export default function Header({ event }: { event: NDKEvent }) {
  const { currentUser } = useCurrentUser();
  const modal = useModal();
  const { ndk } = useNDK();
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [syncingUsers, setSyncingUsers] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const pubkey = event.pubkey;
  const { profile } = useProfile(pubkey);

  const noteIds = getTagsValues("e", event.tags).filter(Boolean);
  const title =
    getTagValues("title", event.tags) ??
    getTagValues("name", event.tags) ??
    "Untitled";
  const image =
    getTagValues("image", event.tags) ??
    getTagValues("picture", event.tags) ??
    getTagValues("banner", event.tags) ??
    profile?.banner;

  const description = getTagValues("description", event.tags);
  const rawEvent = event.rawEvent();
  const priceInBTC = parseFloat(getTagValues("price", rawEvent.tags) ?? "0");
  const isMember =
    currentUser &&
    getTagsValues("p", rawEvent.tags).includes(currentUser.pubkey);
  const delegate = getTagValues("delegate", event.tags);

  useEffect(() => {
    if (!currentUser) return;
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
  async function handleSyncUsers() {
    if (!event || !ndk) return;
    setSyncingUsers(true);
    try {
      console.log("handleSyncUsers");
      await updateListUsersFromZaps(ndk, event.tagId(), rawEvent);
      toast.success("Users Synced!");
    } catch (err) {
      console.log("error syncing users", err);
    } finally {
      setSyncingUsers(false);
    }
  }
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
          {!!image && (
            <Image
              className="absolute inset-0 h-full w-full object-cover align-middle"
              src={image}
              width={400}
              height={100}
              alt="banner"
              unoptimized
            />
          )}
        </div>
      </div>
      <div className="space-y-1 p-3 @sm:px-3.5 @sm:pb-2 @sm:pt-5">
        <div className="flex items-start justify-between gap-x-1.5 @lg:gap-x-2.5">
          <div className="space-y-1 @sm:space-y-2">
            <h2 className="font-condensed text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <div className="flex items-center">
              <ProfileInfo pubkey={pubkey} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!!currentUser && currentUser.pubkey === pubkey && (
              <>
                <Button onClick={() => modal?.show(<CreateEventModal />)}>
                  Add Note
                </Button>
                <Button
                  variant={"outline"}
                  loading={syncingUsers}
                  onClick={() => void handleSyncUsers()}
                >
                  Sync users
                </Button>
                {/* <Button
                  variant="ghost"
                  onClick={() =>
                    modal?.show(<EditListModal listEvent={rawEvent} />)
                  }
                >
                  Edit
                </Button> */}
              </>
            )}
            {!isMember &&
              (hasValidPayment ? (
                <Button variant={"outline"}>Pending Sync</Button>
              ) : (
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
                >
                  Subscribe
                </Button>
              ))}
          </div>
        </div>

        <div className="pt-1 @md:pt-2">
          {!!description && (
            <p className="line-clamp-3 text-sm text-muted-foreground md:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
