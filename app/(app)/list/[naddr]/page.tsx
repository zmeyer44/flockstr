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

const demo = [
  {
    id: "1",
    title: "BTC Radio",
    description:
      "BTC Radio is the best fuking show ever. you should sub to it. now",
    picture:
      "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/51602.original.png?1693358530",
    tags: ["music", "crypto", "art"],
  },
];

export default function ListPage({
  params: { naddr },
}: {
  params: {
    naddr: string;
  };
}) {
  const [activeTab, setActiveTab] = useState("feed");
  const { type, data } = nip19.decode(naddr);
  console.log("PASSED", naddr, data);
  if (type !== "naddr") {
    throw new Error("Invalid list");
  }
  const { identifier, kind, pubkey } = data;
  const { profile } = useProfile(pubkey);
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
  const title =
    getTagValues("title", event.tags) ??
    getTagValues("name", event.tags) ??
    "Untitled";
  const image =
    getTagValues("image", event.tags) ??
    getTagValues("picture", event.tags) ??
    getTagValues("banner", event.tags) ??
    profile?.banner;

  const description = getTagValues("description", event.tags);
  return (
    <div className="relative mx-auto max-w-5xl space-y-4 p-2 sm:p-4">
      <div className="relative overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem] @container">
        <div className="overflow-hidden rounded-[0.5rem] p-0">
          <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary pb-[50%] @5xl:rounded-[20px] md:pb-[40%]">
            {!!image && (
              <Image
                className="absolute inset-0 h-full w-full object-cover align-middle"
                src={image}
                width={400}
                height={100}
                alt="banner"
                unoptimized
              />
            )}
          </div>
        </div>
        <div className="space-y-1 p-3 @sm:px-3.5 @sm:pb-2 @sm:pt-5">
          <div className="flex justify-between gap-x-1.5 @lg:gap-x-2.5">
            <div className="space-y-1 @sm:space-y-2">
              <h2 className="font-condensed text-2xl font-semibold sm:text-3xl lg:text-4xl">
                {title}
              </h2>
              <div className="flex items-center">
                <ProfileInfo pubkey={pubkey} />
              </div>
            </div>
            <Button>Subscribe</Button>
          </div>

          <div className="pt-1 @md:pt-2">
            {!!description && (
              <p className="line-clamp-3 text-sm text-muted-foreground md:text-sm">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem] @container">
        <div className="space-y-3 overflow-hidden rounded-[0.5rem] p-0">
          <Feed
            filter={{
              ids: noteIds,
            }}
          />
        </div>
      </div>
    </div>
  );
}
