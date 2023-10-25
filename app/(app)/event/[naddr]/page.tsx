"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import Spinner from "@/components/spinner";
import {
  getTagAllValues,
  getTagValues,
  getTagsAllValues,
  getTagsValues,
} from "@/lib/nostr/utils";

import Header from "./_components/Header";
import LocationPreview from "@/components/LocationPreview";
import HostsContainer from "./_components/HostsContainer";
import LocationContainer from "./_components/LocationContainer";
import AnnouncementsContainer from "./_components/AnnouncementsContainer";
import DiscussionContainer from "./_components/DiscussionContainer";
import AttendeesContainer from "./_components/AttendeesContainer";

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
  const { tags } = event;
  const eventReference = event.encode();

  const location = getTagAllValues("location", tags)[0]
    ? getTagAllValues("location", tags)
    : getTagAllValues("address", tags);
  const geohash = getTagValues("g", tags);
  const hosts = getTagsAllValues("p", tags)
    .filter(([pubkey, relay, role]) => role === "host")
    .map(([pubkey]) => pubkey)
    .filter(Boolean);
  const attendees = getTagsAllValues("p", tags)
    .map(([pubkey]) => pubkey)
    .filter(Boolean);

  return (
    <div className="relative mx-auto max-w-5xl space-y-4 p-2 @container sm:p-4">
      <Header event={event} />
      <div className="flex flex-col gap-4 @2xl:flex-row-reverse">
        <div className="flex min-w-[250px] flex-1 flex-col gap-4">
          {!!location && !!geohash && (
            <LocationContainer
              address={location[0] as string}
              geohash={geohash}
            />
          )}
          <HostsContainer hosts={hosts} />
          <AttendeesContainer attendees={attendees} />
        </div>
        <div className="max-w-2xl grow space-y-4">
          <AnnouncementsContainer
            eventReference={eventReference}
            hosts={hosts}
          />
          <DiscussionContainer eventReference={eventReference} />
        </div>
      </div>
    </div>
  );
}
