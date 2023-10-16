"use client";
import { useEffect } from "react";
import Article from "@/containers/Article";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { nip19, type Event } from "nostr-tools";
import Spinner from "@/components/spinner";
import useEvents from "@/lib/hooks/useEvents";
import KindCard from "@/components/KindCard";
export default function EventPage({
  params: { key },
}: {
  params: {
    key: string;
  };
}) {
  const { ndk } = useNDK();
  const { data, type } = nip19.decode(key);
  const { events } = useEvents({
    filter:
      type === "naddr"
        ? {
            kinds: [data.kind],
            ["#d"]: [data.identifier],
            limit: 1,
          }
        : {},
  });

  if (events?.[0]) {
    const event = events[0].rawEvent() as Event;
    return (
      <div className="center pt-7 text-primary">
        <KindCard {...event} />
      </div>
    );
  }

  return (
    <div className="center pt-20 text-primary">
      <Spinner />
    </div>
  );
}
