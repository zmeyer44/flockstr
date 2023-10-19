"use client";
import Link from "next/link";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import useEvents from "@/lib/hooks/useEvents";
import { Event } from "nostr-tools";
import KindLoading from "@/components/KindCard/loading";
import { nip19 } from "nostr-tools";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { NOTABLE_ACCOUNTS } from "@/constants";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { uniqBy } from "ramda";
import ListCard from "@/components/ListCard";

export default function FeaturedLists() {
  const { events } = useEvents({
    filter: {
      kinds: [30001 as NDKKind],
      authors: NOTABLE_ACCOUNTS.map((a) => nip19.decode(a).data.toString()),
      limit: 60,
    },
  });
  const uniq = uniqBy((e) => getTagValues("title", e.tags), events);
  const processedEvents = uniqBy((e) => getTagValues("d", e.tags), uniq)
    .filter(
      (a) =>
        !!getTagValues("image", a.tags) ?? !!getTagValues("picture", a.tags),
    )
    .sort((a, b) => {
      const aTitle =
        getTagValues("title", a.tags) ??
        getTagValues("description", a.tags) ??
        a.content;
      const bTitle =
        getTagValues("title", b.tags) ??
        getTagValues("description", b.tags) ??
        b.content;
      const aTitleLength = aTitle?.split(" ").length ?? 0;
      const bTitleLength = bTitle?.split(" ").length ?? 0;
      if (aTitleLength && bTitleLength) {
        if (aTitleLength < bTitleLength) {
          return 1;
        } else return -1;
      }
      if (bTitleLength) return 1;
      return -1;
    });

  return (
    <Section>
      <SectionHeader>
        <div className="center gap-x-2">
          <SectionTitle>Featured Lists</SectionTitle>
        </div>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="sm:md-feed-cols relative flex flex-col gap-3">
        {processedEvents.map((e) => (
          <Link key={e.id} href={`/list/${e.encode()}`}>
            <ListCard key={e.id} event={e} />
          </Link>
        ))}
      </SectionContent>
    </Section>
  );
}
