"use client";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import KindCard from "@/components/KindCard";
import { NOTABLE_ACCOUNTS } from "@/constants";
import Link from "next/link";
import useEvents from "@/lib/hooks/useEvents";
import { Event } from "nostr-tools";
import KindLoading from "@/components/KindCard/loading";
import { nip19 } from "nostr-tools";
import { getTagValues } from "@/lib/nostr/utils";

export default function LongFormContentSection() {
  const { events } = useEvents({
    filter: {
      kinds: [30023],
      authors: NOTABLE_ACCOUNTS.map((a) => nip19.decode(a).data.toString()),
      limit: 10,
    },
  });
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Long form content</SectionTitle>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="sm:lg-feed-cols relative mx-auto flex flex-col gap-4">
        {events?.length ? (
          events
            .filter((e) => !!getTagValues("summary", e.tags))
            .slice(0, 6)
            .map((e, idx) => {
              if (idx > 6) return null;
              const event = e.rawEvent() as Event;

              return (
                <Link key={e.id} href={`/article/${e.encode()}`}>
                  <KindCard {...event} />
                </Link>
              );
            })
        ) : (
          <>
            <KindLoading />
            <KindLoading />
            <KindLoading />
            <KindLoading />
          </>
        )}
      </SectionContent>
    </Section>
  );
}
