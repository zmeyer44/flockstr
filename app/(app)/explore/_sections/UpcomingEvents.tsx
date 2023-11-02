"use client";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import CalendarEventCard, {
  CardLoading,
} from "@/components/Cards/CalendarEvent";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import useEvents from "@/lib/hooks/useEvents";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { uniqBy } from "ramda";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";

export default function UpcomingEventsSection() {
  const { events } = useEvents({
    filter: {
      kinds: [31923 as NDKKind],
      limit: 10,
    },
  });

  console.log("UpcomingEventsSection", events);

  const processedEvents = uniqBy(
    (e) => getTagValues("name", e.tags),
    events,
  ).sort((a, b) => {
    const aImage = getTagValues("image", a.tags);
    const bImage = getTagValues("image", b.tags);
    if (aImage && bImage) {
      return 0;
    }
    if (bImage) return 1;
    return -1;
  });

  return (
    <Section className="max-sm:-mx-5">
      <SectionHeader>
        <div className="center gap-x-2 max-sm:px-5">
          <SectionTitle>Upcoming Events</SectionTitle>
        </div>
        <Link href="/events">
          <Button variant={"ghost"}>
            View all <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </SectionHeader>
      <SectionContent className="relative">
        <ScrollArea>
          <div className="flex space-x-2 pb-4 max-sm:px-5">
            {processedEvents?.length ? (
              processedEvents
                .filter(
                  (e) =>
                    parseInt(getTagValues("start", e.tags) ?? "0") >
                    unixTimeNowInSeconds(),
                )
                .slice(0, 8)
                .map((e, idx) => {
                  return (
                    <Link key={e.id} href={`/event/${e.encode()}`}>
                      <CalendarEventCard
                        event={e.rawEvent()}
                        className="min-w-[250px] max-w-[350px]"
                      />
                    </Link>
                  );
                })
            ) : (
              <>
                <CardLoading className="min-w-[250px] max-w-[350px]" />
                <CardLoading className="min-w-[250px] max-w-[350px]" />
                <CardLoading className="min-w-[250px] max-w-[350px]" />
                <CardLoading className="min-w-[250px] max-w-[350px]" />
              </>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}
