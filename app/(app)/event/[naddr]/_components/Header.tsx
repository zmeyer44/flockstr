"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import useProfile from "@/lib/hooks/useProfile";
import { HiOutlineLightningBolt } from "react-icons/hi";
import Spinner from "@/components/spinner";
import {
  getTagAllValues,
  getTagValues,
  getTagsValues,
} from "@/lib/nostr/utils";
import ProfileInfo from "./ProfileInfo";
import CalendarInfo from "./CalendarInfo";
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
import SmallCalendarIcon from "@/components/EventIcons/DateIcon";
import LocationIcon from "@/components/EventIcons/LocationIcon";
import BannerImage from "@/components/PageComponents/BannerImage";
const RSVPButton = dynamic(() => import("./RSVPButton"), {
  ssr: false,
});

const EditEventButton = dynamic(() => import("./EditEventButton"), {
  ssr: false,
});

export default function Header({ event }: { event: NDKEvent }) {
  const { currentUser } = useCurrentUser();
  const modal = useModal();
  const { ndk } = useNDK();
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const { pubkey, tags } = event;
  const { profile } = useProfile(pubkey);
  const eventReference = event.tagId();
  const title = getTagValues("name", tags) ?? "Untitled";
  const image =
    getTagValues("image", tags) ??
    getTagValues("picture", tags) ??
    getTagValues("banner", tags) ??
    profile?.banner;

  const description = event.content;
  const startDate = getTagValues("start", tags)
    ? new Date(parseInt(getTagValues("start", tags) as string) * 1000)
    : null;
  const endDate = getTagValues("end", tags)
    ? new Date(parseInt(getTagValues("end", tags) as string) * 1000)
    : null;
  const getLocation = () => {
    let temp = getTagAllValues("location", tags);
    if (temp[0]) {
      return temp;
    }
    return getTagAllValues("address", tags);
  };
  const location = getLocation();
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
        `Access payment: ${title}`,
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
        <div className="flex items-start justify-between gap-x-1.5 overflow-hidden @lg:gap-x-2.5">
          <div className="space-y-1 @sm:space-y-2">
            <h2 className="font-condensed text-2xl font-semibold sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <div className="flex items-center">
              <CalendarInfo eventReference={eventReference} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {!!currentUser && currentUser.pubkey === pubkey && (
              <EditEventButton event={event.rawEvent()} />
            )}
            {!isMember && <RSVPButton event={event} />}
            {/* {!isMember &&
              (hasValidPayment ? (
                <Button variant={"outline"}>Pending Sync</Button>
              ) : (
                <Button
                  onClick={() =>
                    modal?.show(
                      <ConfirmModal
                        title={`Subscribe to ${title}`}
                        onConfirm={handleSendZap}
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
                  RSVP
                </Button>
              ))} */}
          </div>
        </div>
        <div className="flex flex-col gap-x-6 gap-y-3 pt-1 @md:pt-2 @xl:flex-row">
          <div className="flex-1">
            {!!description && (
              <p className="text-sm text-muted-foreground @md:text-sm">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-1 @xl:justify-end">
            <div className="flex flex-col gap-3 pr-3">
              {!!startDate && (
                <div className="flex flex-1 items-center gap-3">
                  <SmallCalendarIcon date={startDate} />
                  <div className="">
                    <p className="text-bold text-sm @xl:text-base">
                      {formatDate(startDate, "dddd, MMMM Do")}
                    </p>
                    {!!endDate ? (
                      <p className="text-xs text-muted-foreground @xl:text-sm">{`${formatDate(
                        startDate,
                        "h:mm a",
                      )} to ${formatDate(endDate, "h:mm a")}`}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground @xl:text-sm">{`${formatDate(
                        startDate,
                        "h:mm a",
                      )}`}</p>
                    )}
                  </div>
                </div>
              )}
              {!!location && (
                <div className="flex flex-1 items-center gap-3">
                  <LocationIcon />
                  <div className="overflow-hidden">
                    {location.length > 2 ? (
                      <>
                        <p className="text-bold line-clamp-2 text-sm @xl:text-base">
                          {location[1]}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground @xl:text-sm">
                          {location[2]}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm">{location[0]}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
