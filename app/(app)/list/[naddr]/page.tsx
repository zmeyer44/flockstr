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
import { getTagValues } from "@/lib/nostr/utils";

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
      <div className="center ">
        <Spinner />
      </div>
    );
  }
  const title =
    getTagValues("title", event.tags) ??
    getTagValues("name", event.tags) ??
    "Untitled";
  const image =
    getTagValues("image", event.tags) ??
    getTagValues("picture", event.tags) ??
    getTagValues("benner", event.tags);

  const description = getTagValues("description", event.tags);
  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      <div className="relative bg-muted @container">
        <div className="absolute top-0 h-[8rem] w-full" />
        <div className="mx-auto max-w-5xl p-0">
          <div className="m-0 @5xl:px-5 @5xl:pt-8">
            <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary pb-[29%] @5xl:rounded-[20px]">
              {!!profile?.banner && (
                <Image
                  className="absolute inset-0 h-full w-full object-cover align-middle"
                  src={profile.banner}
                  width={400}
                  height={100}
                  alt="banner"
                  unoptimized
                />
              )}
            </div>
          </div>
        </div>
        <div className="relative mx-auto mb-4 mt-[calc(-0.4375_*_4rem)] flex max-w-[800px] items-end justify-between gap-2 px-3 sm:mt-[calc(-0.4375_*_4.5rem)] sm:px-5 md:mt-[calc(-0.5625_*_5rem)] lg:mt-[calc(-0.5625_*_6rem)]">
          <div className="z-1 ml-[calc(-1_*_3px)] overflow-hidden rounded-[0.5rem] bg-background p-[3px] sm:ml-[calc(-1_*_4px)] sm:p-[4px] lg:ml-[calc(-1_*_6px)] lg:rounded-[1rem] lg:p-[6px]">
            {profile?.image ? (
              <Image
                src={profile.image}
                className="aspect-square w-[4rem] overflow-hidden rounded-[calc(0.5rem_-_3px)] object-cover object-center sm:w-[4.5rem] sm:rounded-[calc(0.5rem_-_4px)] md:w-[5rem] lg:w-[6rem] lg:rounded-[calc(1rem_-_6px)]"
                unoptimized
                alt="profile picture"
                width={16}
                height={16}
              />
            ) : (
              <div className="center aspect-square w-[4rem] overflow-hidden rounded-[calc(0.5rem_-_3px)] bg-muted object-cover object-center text-primary @xl:text-2xl sm:w-[4.5rem] sm:rounded-[calc(0.5rem_-_4px)] md:w-[5rem] lg:w-[6rem] lg:rounded-[calc(1rem_-_6px)]"></div>
            )}
          </div>
          <Button size={"sm"} className="rounded-sm px-5 sm:hidden">
            Follow
          </Button>
          <Button className="rounded-sm px-5 max-sm:hidden">Follow</Button>
        </div>
        <div className="mx-auto max-w-[800px] space-y-1 px-4">
          <div className="flex items-center gap-x-1.5 lg:gap-x-2.5">
            <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
              {title}
            </h2>
            {!!profile?.nip05 && (
              <HiCheckBadge className="h-5 w-5 text-primary lg:h-7 lg:w-7" />
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground/80 md:text-sm">
            {!!profile?.name && <p>{profile.name}</p>}
            {!!profile?.name && !!profile.nip05 && (
              <>
                <div className="inline-flex px-1">·</div>
                <p>{profile.nip05}</p>
              </>
            )}
          </div>
          <div className="pt-1 md:pt-2">
            {!!description && (
              <p className="line-clamp-3 text-xs text-muted-foreground md:text-sm">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[800px] space-y-6">
        <div className="flex max-w-2xl flex-col gap-5">
          {demo.map((e) => (
            <SubscriptionCard key={e.id} {...e} />
          ))}
        </div>
        <div className="">
          <Tabs
            tabs={[
              {
                name: "feed",
                label: "Feed",
              },
              {
                name: "media",
                label: "Media",
              },
              {
                name: "subscriptions",
                label: "Subscriptions",
              },
            ]}
            activeTab={activeTab}
            setActiveTab={(t) => setActiveTab(t.name)}
          />
        </div>
      </div>
    </div>
  );
}