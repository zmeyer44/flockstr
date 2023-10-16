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
import { DUMMY_30023 } from "@/constants";
import Link from "next/link";
import useEvents from "@/lib/hooks/useEvents";
import { Event } from "nostr-tools";
import KindLoading from "@/components/KindCard/loading";

export default function LongFormContentSection() {
  const { events } = useEvents({
    filter: {
      kinds: [30023],
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
          events.map((e) => {
            const event = e.rawEvent() as Event;
            return (
              <Link key={e.id} href={`/article/${e.tagId}`}>
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
