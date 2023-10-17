"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
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

const EditListModal = dynamic(() => import("@/components/Modals/EditList"), {
  ssr: false,
});
const CreateEventModal = dynamic(() => import("@/components/Modals/NewEvent"), {
  ssr: false,
});

export default function Header({ naddr }: { naddr: string }) {
  const { currentUser } = useCurrentUser();
  const modal = useModal();
  const { ndk } = useNDK();
  const [sendingZap, setSendingZap] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const [syncingUsers, setSyncingUsers] = useState(false);
  const { type, data } = nip19.decode(naddr);
  console.log("PASSED", naddr, data);
  if (type !== "naddr") {
    throw new Error("Invalid list");
  }
  const { identifier, kind, pubkey } = data;
  const { profile } = useProfile(pubkey);
  const { events } = useEvents({
    filter: {
      authors: [pubkey],
      kinds: [kind],
      ["#d"]: [identifier],
      limit: 1,
    },
  });
  const event = events[0];

  if (!event) {
    return (
      <div className="center pt-20 text-primary">
        <Spinner />
      </div>
    );
  }
  const noteIds = getTagsValues("e", event.tags).filter(Boolean);
  console.log("notes", event.tags);
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
  const subscriptionsEnabled = !!getTagValues("subscriptions", rawEvent.tags);
  const priceInBTC = getTagValues("price", rawEvent.tags);
  const isMember =
    currentUser &&
    getTagsValues("p", rawEvent.tags).includes(currentUser.pubkey);

  useEffect(() => {
    if (!currentUser || !subscriptionsEnabled) return;
    if (!isMember && !checkingPayment && !hasValidPayment) {
      void handleCheckPayment();
    }
  }, [isMember, currentUser]);

  async function handleCheckPayment() {
    if (!event) return;
    setCheckingPayment(true);
    console.log("Checking payment");
    try {
      const result = await checkPayment(
        ndk!,
        event.tagId(),
        currentUser!.hexpubkey,
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
    if (!event) return;
    setSyncingUsers(true);
    try {
      console.log("handleSyncUsers");
      await updateListUsersFromZaps(ndk!, event.tagId(), rawEvent);
      toast.success("Users Synced!");
    } catch (err) {
      console.log("error syncing users", err);
    } finally {
      setSyncingUsers(false);
    }
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
          <div className="flex items-center gap-3">
            {!!currentUser && currentUser.pubkey === pubkey && (
              <>
                <Button onClick={() => modal?.show(<CreateEventModal />)}>
                  Add Event
                </Button>
                <Button
                  variant={"outline"}
                  loading={syncingUsers}
                  onClick={() => void handleSyncUsers()}
                >
                  Sync users
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    modal?.show(<EditListModal listEvent={rawEvent} />)
                  }
                >
                  Edit
                </Button>
              </>
            )}
            {subscriptionsEnabled && !isMember && <Button>Subscribe</Button>}
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
