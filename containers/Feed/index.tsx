"use client";
import KindCard from "@/components/KindCard";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { Event } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import { NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
type FeedProps = {
  filter?: NDKFilter;
  secondaryFilter?: (event: NDKEvent) => Boolean;
  className?: string;
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
};

export default function Feed({
  filter,
  secondaryFilter,
  loader: Loader,
  empty: Empty,
}: FeedProps) {
  const { events, isLoading } = useEvents({
    filter: { ...filter },
  });
  if (isLoading) {
    if (Loader) {
      return <Loader />;
    }
    return <Spinner />;
  }
  if (Empty && events.length === 0) {
    return <Empty />;
  }
  if (secondaryFilter) {
    return (
      <>
        {events.filter(secondaryFilter).map((e) => {
          const event = e.rawEvent() as Event;
          return <KindCard key={e.id} {...event} />;
        })}
      </>
    );
  }
  return (
    <>
      {events.map((e) => {
        const event = e.rawEvent() as Event;
        return <KindCard key={e.id} {...event} />;
      })}
    </>
  );
}
