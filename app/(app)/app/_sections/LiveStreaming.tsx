"use client";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import LiveBadge from "@/components/Badges/LiveBadge";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import VideoCard, { VideoCardLoading } from "@/components/VideoCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import useEvents from "@/lib/hooks/useEvents";
import { Event } from "nostr-tools";
import KindLoading from "@/components/KindCard/loading";
import { nip19 } from "nostr-tools";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { NOTABLE_ACCOUNTS } from "@/constants";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { uniqBy } from "ramda";

export default function LiveStreamingSection() {
  const { events } = useEvents({
    filter: {
      kinds: [30311 as NDKKind],
      limit: 5,
    },
  });

  const processedEvents = uniqBy(
    (e) => getTagValues("title", e.tags),
    events,
  ).sort((a, b) => {
    const aParticipants =
      getTagValues("total_participants", a.tags) ??
      getTagValues("current_participants", a.tags);
    const bParticipants =
      getTagValues("total_participants", b.tags) ??
      getTagValues("current_participants", b.tags);
    if (aParticipants && bParticipants) {
      if (parseInt(aParticipants) < parseInt(bParticipants)) {
        return 1;
      } else return -1;
    }
    if (bParticipants) return 1;
    return -1;
  });
  return (
    <Section className="max-sm:-mx-5">
      <SectionHeader>
        <div className="center gap-x-2 max-sm:px-5">
          <SectionTitle>Streaming Now</SectionTitle>
          <LiveBadge text={"LIVE"} />
        </div>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="relative">
        <ScrollArea>
          <div className="flex space-x-2 pb-4 max-sm:px-5">
            {processedEvents?.length > 3 ? (
              processedEvents
                .filter((e) => !!getTagValues("summary", e.tags))
                .slice(0, 6)
                .map((e, idx) => {
                  const event = e.rawEvent() as Event;
                  const image = getTagValues("image", event.tags) as string;
                  const title = getTagValues("title", event.tags) as string;
                  const starts = getTagValues("starts", event.tags) as string;
                  const ends = getTagValues("ends", event.tags) as string;
                  const tags = getTagsValues("t", event.tags) as string[];
                  const total_participants =
                    getTagValues("total_participants", event.tags) ??
                    (getTagValues(
                      "current_participants",
                      event.tags,
                    ) as string);
                  const status = getTagValues("status", event.tags) as
                    | "live"
                    | "planned"
                    | "ended";

                  return (
                    <Link key={e.id} href={`/article/${e.encode()}`}>
                      <VideoCard
                        card={{
                          image,
                          tags,
                          title,
                          starts: parseInt(starts),
                          ends: parseInt(ends),
                          total_participants: total_participants
                            ? parseInt(total_participants)
                            : undefined,
                          status,
                        }}
                        className="min-w-[250px] max-w-[350px]"
                      />
                    </Link>
                  );
                })
            ) : (
              <>
                <VideoCardLoading className="min-w-[250px] max-w-[350px]" />
                <VideoCardLoading className="min-w-[250px] max-w-[350px]" />
                <VideoCardLoading className="min-w-[250px] max-w-[350px]" />
                <VideoCardLoading className="min-w-[250px] max-w-[350px]" />
              </>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}
