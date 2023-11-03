"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { nip19 } from "nostr-tools";
import { getLettersPlain } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HiMiniChevronRight, HiCalendarDays } from "react-icons/hi2";
import useEvents from "@/lib/hooks/useEvents";
import { getTagValues } from "@/lib/nostr/utils";
import ProfileInfo from "./ProfileInfo";
import { type NDKKind, type NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "@/app/_providers/ndk";

type CalendarInfoProps = {
  eventReference: string;
};
export default function CalendarInfo({ eventReference }: CalendarInfoProps) {
  console.log("eventReference", eventReference);
  const [kind, pubkey, identifier] = eventReference.split(":") as [
    string,
    string,
    string,
  ];

  const { ndk } = useNDK();
  const [event, setEvent] = useState<NDKEvent>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!ndk || isFetching || event) return;
    handleFetchEvent();
  }, [ndk, eventReference]);

  async function handleFetchEvent() {
    if (!ndk) return;
    setIsFetching(true);

    const calendarEvent = await ndk
      .fetchEvent({
        authors: [pubkey],
        ["#a"]: [eventReference],
        kinds: [31924 as NDKKind],
      })
      .catch((err) => console.log("err"));
    if (calendarEvent) {
      console.log("Found calendar", calendarEvent);
      setEvent(calendarEvent);
    }
    setIsFetching(false);
  }

  if (!event) {
    return <ProfileInfo pubkey={pubkey} />;
  }
  const image = getTagValues("image", event.tags);
  const name = getTagValues("name", event.tags);
  return (
    <Link
      href={`/calendar/${event.encode()}`}
      className="center group gap-x-2 rounded-sm rounded-r-full border bg-background/50 pl-0.5 pr-1 text-muted-foreground hover:shadow"
    >
      <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.25rem] bg-muted @sm:h-[18px] @sm:w-[18px]">
        <AvatarImage src={image} alt={name ?? "event"} />
        <AvatarFallback className="text-[8px]">
          {getLettersPlain(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1">
        <span className="text-[14px] ">{name ?? "Calendar"}</span>
        <HiCalendarDays className="h-3 w-3 text-primary" />
      </div>
      <HiMiniChevronRight className="h-4 w-4" />
    </Link>
  );
}

export function LoadingCalendarInfo() {
  return (
    <div className="center group gap-x-1">
      <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.25rem] bg-muted @sm:h-[18px] @sm:w-[18px]"></Avatar>
      <div className="space-y-1">
        <Skeleton className="h-2 w-[70px] bg-muted" />
      </div>
    </div>
  );
}
