"use client";
import { useRef, useEffect, useState } from "react";
import { CardLoading } from "@/components/Cards/CalendarEvent";
import { formatDate, fromUnix, relativeTime } from "@/lib/utils/dates";

import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { DUMMY_1 } from "@/constants";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import LargeFeedCard from "@/components/Cards/CalendarEvent/LargeFeedCard";
import { cn } from "@/lib/utils";
type CalendarSectionProps = {
  events: NDKEvent[];
};

export default function CalendarSection({ events }: CalendarSectionProps) {
  const { currentUser } = useCurrentUser();
  const firstEvent = events.at(0);
  if (!firstEvent) return null;
  const startDateUnix = getTagValues("start", firstEvent?.tags);
  if (!startDateUnix) return null;
  const startDate = fromUnix(parseInt(startDateUnix));

  return (
    <div className="relative flex w-full items-start gap-x-3 @container">
      {/* Date Indicator */}
      <div className="sticky top-[calc(var(--header-height)_+_28px)] hidden w-[230px] shrink-0 md:block">
        <CalendarIcon date={startDate} />
      </div>
      {/* Date Indicator Mobile */}
      <div className="absolute inset-y-0 right-0 z-50 md:hidden">
        <div className="sticky top-[calc(var(--header-height)_+_14px)] shrink-0">
          <CalendarIconOpacity date={startDate} />
        </div>
      </div>

      {/* Events */}
      <div className="flex-1 space-y-4 max-md:pt-[60px]">
        {events.map((e) => (
          <LargeFeedCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
function CalendarIcon({ date }: { date: Date }) {
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-md border bg-background shadow",
      )}
    >
      <div className="w-fit shrink-0 bg-primary p-1.5 px-3 text-primary-foreground @xl:p-2 @xl:px-3.5">
        {/* <span className="text-2xl font-bold">24</span> */}
        <span className="font-semibold">{formatDate(date, "ddd")}</span>
      </div>
      <div className="center flex whitespace-nowrap px-3 text-sm font-medium text-muted-foreground @lg:text-base @xl:px-3.5">
        <div className="">
          {formatDate(date, "MMMM Do")}
          <span className="-mt-2 block text-[10px] font-normal">
            {relativeTime(date)}
          </span>
        </div>
      </div>
    </div>
  );
}
function CalendarIconOpacity({ date }: { date: Date }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(false);

  useEffect(() => {
    // Add a scroll event listener to the window
    const handleScroll = () => {
      if (ref.current) {
        // Get the position of the div relative to the viewport
        const divRect = ref.current.getBoundingClientRect();
        // Change the opacity when the div reaches the top of the screen
        if (divRect.top <= 110) {
          setTop(true);
        } else {
          setTop(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Remove the scroll event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div ref={ref} className={cn(top && "opacity-50")}>
      <CalendarIcon date={date} />
    </div>
  );
}
