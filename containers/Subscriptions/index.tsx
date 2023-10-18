"use client";
import KindCard from "@/components/KindCard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Spinner from "@/components/spinner";
import { Event } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import NDK, { NDKEvent, type NDKFilter } from "@nostr-dev-kit/ndk";
import ListCard from "@/components/ListCard";

type SubscriptionsProps = {
  pubkey: string;
  link?: boolean;
  className?: string;
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
};

export default function Subscriptions({
  pubkey,
  link = false,
  className,
  loader: Loader,
  empty: Empty,
}: SubscriptionsProps) {
  const { events, isLoading } = useEvents({
    filter: {
      kinds: [30001],
      ["#p"]: [pubkey],
    },
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
  if (link) {
    return (
      <>
        {events.map((e) => {
          return (
            <Link href={`/list/${e.encode()}`}>
              <ListCard key={e.id} event={e} />;
            </Link>
          );
        })}
      </>
    );
  }
  return (
    <>
      {events.map((e) => {
        return <ListCard key={e.id} event={e} />;
      })}
    </>
  );
}
