"use client";
import { useState } from "react";
import Image from "next/image";
import { nip19 } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import Spinner from "@/components/spinner";
import {
  getTagAllValues,
  getTagValues,
  getTagsValues,
} from "@/lib/nostr/utils";
import Feed from "@/containers/Feed";
import Header from "./_components/Header";
import LocationPreview from "@/components/LocationPreview";

export default function EventPage({
  params: { naddr },
}: {
  params: {
    naddr: string;
  };
}) {
  const { type, data } = nip19.decode(naddr);
  if (type !== "naddr") {
    throw new Error("Invalid list");
  }
  const { identifier, kind, pubkey } = data;
  const { events } = useEvents({
    filter: {
      authors: [pubkey],
      kinds: [kind],
      ["#d"]: [identifier],
      limit: 1,
    },
  });
  const event = events[0];

  if (!event) {
    return (
      <div className="center pt-20 text-primary">
        <Spinner />
      </div>
    );
  }
  const noteIds = getTagsValues("e", event.tags).filter(Boolean);
  const location = getTagAllValues("location", event.tags)[0]
    ? getTagAllValues("location", event.tags)
    : getTagAllValues("address", event.tags);
  const geohash = getTagValues("g", event.tags);

  return (
    <div className="relative mx-auto max-w-5xl space-y-4 p-2 sm:p-4">
      <Header event={event} />
      <div className="relative overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem] @container">
        <div className="flex flex-col gap-3 @xl:flex-row-reverse">
          {!!location && !!geohash && (
            <LocationPreview
              geohash={geohash}
              address={location[0] as string}
            />
          )}
          <div className="flex-1 space-y-3 overflow-hidden rounded-[0.5rem] p-0">
            <Feed
              filter={{
                ids: noteIds,
              }}
              empty={() => (
                <div className="pt-5 text-center text-muted-foreground">
                  <p>No Announcements yet</p>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
