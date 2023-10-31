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
import { type NDKKind } from "@nostr-dev-kit/ndk";
import Header from "./_components/Header";
import EventsFromCalendar from "@/containers/EventsTimeline/EventsFromCalendar";

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
  return (
    <div className="relative mx-auto max-w-5xl space-y-4 p-2 @container sm:p-4">
      <Header event={event} />
      <div className="flex flex-col pt-5 sm:gap-6">
        <div className="flex items-center justify-between px-0">
          <h2 className="font-condensed text-2xl font-bold">Upcoming Events</h2>
        </div>
        <div className="mx-auto w-full max-w-[900px] space-y-6">
          <EventsFromCalendar
            calendar={event}
            empty={() => (
              <div className="py-3 text-center text-sm text-muted-foreground">
                <p>No upcoming events</p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
