"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HiCheckBadge } from "react-icons/hi2";
import Tabs from "@/components/Tabs";
import useProfile from "@/lib/hooks/useProfile";
import { getTwoLetters, truncateText } from "@/lib/utils";
import { nip19 } from "nostr-tools";
import useEvents from "@/lib/hooks/useEvents";
import Spinner from "@/components/spinner";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import ProfileInfo from "./_components/ProfileInfo";
import Feed from "@/containers/Feed";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import Header from "./_components/Header";

export default function ListPage({
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
  console.log("notes", event.tags);

  return (
    <div className="relative mx-auto max-w-5xl space-y-4 p-2 sm:p-4">
      <Header event={event} />
      <div className="relative overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem] @container">
        <div className="space-y-3 overflow-hidden rounded-[0.5rem] p-0">
          <Feed
            filter={{
              ids: noteIds,
            }}
            empty={() => (
              <div className="text-center text-muted-foreground">
                <p>No notes yet</p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
