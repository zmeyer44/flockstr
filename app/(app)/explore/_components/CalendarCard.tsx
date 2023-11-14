"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getLettersPlain, getTwoLetters } from "@/lib/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { BANNER } from "@/constants/app";
import { nip19 } from "nostr-tools";
import useProfile from "@/lib/hooks/useProfile";
import useEvents from "@/lib/hooks/useEvents";
import {
  getTagsValues,
  getTagValues,
  sortEventsByTagNumber,
} from "@/lib/nostr/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { uniqBy } from "ramda";
type CalendarCardProps = {
  calendar: NDKEvent;
};

export default function CalendarCard({ calendar }: CalendarCardProps) {
  const { pubkey, tags, content } = calendar;
  const { profile } = useProfile(pubkey);
  const encodedEvent = calendar.encode();
  const [upcomingEvents, setUpcomingEvents] = useState<NDKEvent[]>([]);
  const name = getTagValues("name", tags);
  const image = getTagValues("image", tags);
  const banner =
    getTagValues("banner", tags) ?? profile?.image ?? profile?.banner ?? BANNER;
  const description = content ?? getTagValues("about", tags);
  const calendarEvents = getTagsValues("a", tags);
  const calendarEventIdentifiers = calendarEvents
    .filter(Boolean)
    .map((e) => {
      if (e.includes(":") && e.split(":").length === 3) {
        const [kind, pubkey, identifier] = e.split(":") as [
          string,
          string,
          string,
        ];
        return {
          type: "naddr",
          data: {
            kind,
            pubkey,
            identifier,
          },
        };
      } else if (nip19.BECH32_REGEX.test(e)) {
        return nip19.decode(e);
      } else return;
    })
    .filter(Boolean)
    .filter(({ type }) => type === "naddr")
    .map((e) => e.data as nip19.AddressPointer);
  const { events } = useEvents({
    filter: {
      kinds: calendarEventIdentifiers.map((k) => k.kind),
      authors: calendarEventIdentifiers.map((k) => k.pubkey),
      ["#d"]: calendarEventIdentifiers.map((k) => k.identifier),
    },
  });

  useEffect(() => {
    if (events) {
      const filteredEvents = events.filter(
        (e) =>
          parseInt(getTagValues("start", e.tags) ?? "0") >
          unixTimeNowInSeconds(),
      );
      const sortedEvents = sortEventsByTagNumber(filteredEvents, "start");
      setUpcomingEvents(
        uniqBy((e) => getTagValues("name", e.tags), sortedEvents),
      );
    }
  }, [events]);

  return (
    <Card className="relative h-[350px] w-[250px] min-w-[250] overflow-hidden">
      <Image
        alt="background"
        src={banner}
        className="absolute inset-0 object-cover"
        fill
        unoptimized
      />
      <div className="absolute inset-0 bg-zinc-800/20 backdrop-blur-lg transition-all">
        <div className="group relative flex h-full w-full flex-col items-center justify-end transition-all">
          <CardHeader className="absolute inset-x-0 top-[59%] transform pt-4 text-center transition-all duration-300 group-hover:top-[8px] group-hover:ml-[75px] group-hover:text-left">
            <Link href={`/calendar/${encodedEvent}`}>
              <CardTitle className="text-zinc-100 hover:underline">
                {name}
              </CardTitle>
            </Link>
            <CardDescription className="line-clamp-3 text-zinc-200 group-hover:text-xs">
              {description}
            </CardDescription>
          </CardHeader>
          <Avatar className="absolute left-1/2 top-1/2 !aspect-square h-[100px] w-[100px] -translate-x-1/2 -translate-y-[70%] transform overflow-hidden rounded-lg bg-muted object-cover transition-all duration-300 group-hover:left-[50px] group-hover:top-[65px] group-hover:h-[70px] group-hover:w-[70px]">
            <AvatarImage
              src={image ?? BANNER}
              className="object-cover"
              height={100}
              width={100}
            />
            <AvatarFallback>
              {getLettersPlain(name ?? profile?.displayName ?? profile?.name)}
            </AvatarFallback>
          </Avatar>
          {/* <Image
            alt="user"
            src={image ?? BANNER}
            className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-[70%] transform overflow-hidden rounded-lg bg-muted object-cover transition-all duration-300 group-hover:left-[50px] group-hover:top-[65px] group-hover:w-[70px]"
            height={100}
            width={100}
            unoptimized
          /> */}
          <Card className="absolute top-full min-h-full w-5/6 overflow-hidden transition-all duration-300 group-hover:top-1/3">
            <CardHeader className="border-b p-4 pb-3">
              <CardTitle>Upcoming Events:</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden px-0">
              {upcomingEvents.length ? (
                <ul className="w-full">
                  {upcomingEvents.map((item) => {
                    const { tags, content } = item;
                    const encodedEvent = item.encode();
                    const name = getTagValues("name", tags);
                    const description = content;
                    return (
                      <li key={item.id} className="w-full overflow-hidden">
                        <Link
                          href={`/event/${encodedEvent}`}
                          className="flex max-w-full items-center justify-between overflow-hidden py-1.5 pl-4 pr-2 transition-colors hover:bg-muted hover:text-primary"
                        >
                          <div className="shrink overflow-x-hidden">
                            <h4 className="line-clamp-1 text-sm font-semibold text-card-foreground">
                              {name}
                            </h4>
                            <p className="line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                              {description ?? ""}
                            </p>
                          </div>
                          <div className="center ml-auto shrink-0 pl-2">
                            <RiArrowRightLine className="h-5 w-5" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  <p>No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
}
export function LoadingCalendarCard() {
  const textColor = "bg-zinc-200";
  return (
    <Skeleton className="pointer-events-none relative h-[350px] w-[250px] min-w-[250px] overflow-hidden bg-muted">
      <div className="absolute inset-0 backdrop-blur-lg transition-all">
        <div className="group relative flex h-full w-full flex-col items-center justify-end transition-all">
          <CardHeader className="absolute inset-x-0 top-[59%] transform pt-4 text-center transition-all duration-300 group-hover:top-[8px] group-hover:ml-[75px] group-hover:text-left">
            <Skeleton className={cn("mx-auto h-[20px] w-2/3", textColor)} />
            <div className="center flex-col gap-y-2 pt-3">
              <div className="center w-full gap-1">
                <Skeleton className={cn("h-3 w-1/2", textColor)} />
                <Skeleton className={cn("h-3 w-1/3", textColor)} />
              </div>
              <div className="center w-full gap-1">
                <Skeleton className={cn("h-3 w-1/5", textColor)} />
                <Skeleton className={cn("h-3 w-2/5", textColor)} />
              </div>
              <Skeleton className={cn("h-3 w-1/2", textColor)} />
            </div>
          </CardHeader>
          <div className="absolute left-1/2 top-1/2 aspect-square h-[100px] -translate-x-1/2 -translate-y-[70%] transform overflow-hidden rounded-lg bg-muted object-cover transition-all duration-300 group-hover:left-[50px] group-hover:top-[65px] group-hover:w-[70px]">
            <Skeleton className={cn("aspect-square h-[100px]", textColor)} />
          </div>
          <Card className="absolute top-full min-h-full w-5/6 overflow-hidden transition-all duration-300 group-hover:top-1/3">
            <CardHeader className="border-b p-4 pb-3">
              <CardTitle>Upcoming Events:</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden px-0">
              <ul className="w-full">
                <li className="w-full overflow-hidden">
                  <Skeleton className="h-3 w-2/3" />
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Skeleton>
  );
}
