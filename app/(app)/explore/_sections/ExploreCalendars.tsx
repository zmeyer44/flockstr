"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import useEvents from "@/lib/hooks/useEvents";
import { nip19 } from "nostr-tools";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { uniqBy } from "ramda";

import CalendarCard, { LoadingCalendarCard } from "../_components/CalendarCard";
import { getTagValues } from "@/lib/nostr/utils";
export default function ExploreCalendars() {
  return (
    <section className="relative -mx-5 space-y-4 overflow-x-hidden sm:space-y-6">
      <div className="flex items-center justify-between px-5 max-sm:pr-3">
        <h2 className="font-condensed text-2xl font-bold sm:text-3xl">
          Explore Calendars
        </h2>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <HorizontalCarousel />
    </section>
  );
}

function HorizontalCarousel() {
  const { events } = useEvents({
    filter: {
      kinds: [31924 as NDKKind],
      limit: 5,
    },
  });

  if (events.length) {
    return (
      <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
        {uniqBy((e) => getTagValues("title", e.tags), events).map(
          (calendar, index) => (
            <div
              key={calendar.id}
              className={cn("snap-start pl-2 sm:pl-5", index === 0 && "pl-5")}
            >
              <Calendar encodedEvent={calendar.encode()} />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
      {Array.from(Array(5)).map((_, index) => (
        <div
          key={index}
          className={cn("snap-start pl-2 sm:pl-5", index === 0 && "pl-5")}
        >
          <LoadingCalendarCard />
        </div>
      ))}
    </div>
  );
}

function Calendar({ encodedEvent }: { encodedEvent: string }) {
  const { type, data } = nip19.decode(encodedEvent);
  if (type !== "naddr") {
    throw new Error("impoper type");
  }
  const { pubkey, identifier, kind } = data;
  const { events } = useEvents({
    filter: {
      authors: [pubkey],
      ["#d"]: [identifier],
      kinds: [31924 as NDKKind],
      limit: 1,
    },
  });
  const event = events[0];
  if (!event) {
    return null;
  }

  return <CalendarCard calendar={event} key={event.id} />;
}
