"use client";
import KindCard from "@/components/KindCard";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { Event } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import { type NDKFilter } from "@nostr-dev-kit/ndk";
type FeedProps = {
  filter?: NDKFilter;
  className?: string;
  loader?: () => JSX.Element;
};

export default function Feed({ filter, className, loader: Loader }: FeedProps) {
  const { events, isLoading } = useEvents({
    filter: { ...filter },
  });
  if (isLoading) {
    if (Loader) {
      return <Loader />;
    }
    return <Spinner />;
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
