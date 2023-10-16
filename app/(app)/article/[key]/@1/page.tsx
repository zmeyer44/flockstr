"use client";
import { useEffect } from "react";
import Article from "@/containers/Article";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { nip19 } from "nostr-tools";
import Spinner from "@/components/spinner";
import useEvents from "@/lib/hooks/useEvents";
export default function ArticlePage({
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
      type === "note"
        ? {
            ids: [data.toString()],
            limit: 1,
          }
        : {},
  });

  if (events?.[0]) {
    return <div className="center pt-20 text-primary">{events[0].id}</div>;
  }

  return (
    <div className="center pt-20 text-primary">
      <Spinner />
    </div>
  );
}
