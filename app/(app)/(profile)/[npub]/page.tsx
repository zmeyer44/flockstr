"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HiCheckBadge } from "react-icons/hi2";
import Tabs from "@/components/Tabs";

export default function ProfilePage({
  params: { npub },
}: {
  params: {
    npub: string;
  };
}) {
  const [activeTab, setActiveTab] = useState("feed");
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
  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      <div className="relative -mx-5 @container ">
        <div className="absolute top-0 h-[8rem] w-full" />
        <div className="mx-auto max-w-5xl p-0">
          <div className="m-0 @4xl:pt-8 @5xl:px-5">
            <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary pb-[29%] @5xl:rounded-[20px]">
              <Image
                className="absolute inset-0 h-full w-full object-cover align-middle"
                src={
                  "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,quality=75,width=1250,height=357.14285714285717/calendar-cover-images/4m/c50dff9c-12e1-4b8a-ae95-68a36364b760"
                }
                width={400}
                height={100}
                alt="banner"
                unoptimized
              />
            </div>
          </div>
        </div>
        <div className="relative mx-auto mb-4 mt-[calc(-0.4375_*_4rem)] flex max-w-[800px] items-end justify-between gap-2 px-3 sm:mt-[calc(-0.4375_*_4.5rem)] sm:px-5 md:mt-[calc(-0.5625_*_5rem)] lg:mt-[calc(-0.5625_*_6rem)]">
          <div className="z-1 ml-[calc(-1_*_3px)] overflow-hidden rounded-[0.5rem] bg-background p-[3px] sm:ml-[calc(-1_*_4px)] sm:p-[4px] lg:ml-[calc(-1_*_6px)] lg:rounded-[1rem] lg:p-[6px]">
            <Image
              src={
                "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=96,height=96/calendars/hw/70772773-6d97-4fbb-a076-fc4dee603080"
              }
              className="aspect-square w-[4rem] overflow-hidden rounded-[calc(0.5rem_-_3px)] object-cover object-center sm:w-[4.5rem] sm:rounded-[calc(0.5rem_-_4px)] md:w-[5rem] lg:w-[6rem] lg:rounded-[calc(1rem_-_6px)]"
              unoptimized
              alt="profile picture"
              width={16}
              height={16}
            />
          </div>
          <Button size={"sm"} className="rounded-sm px-5 sm:hidden">
            Follow
          </Button>
          <Button className="rounded-sm px-5 max-sm:hidden">Follow</Button>
        </div>
        <div className="mx-auto max-w-[800px] space-y-1 px-4">
          <div className="flex items-center gap-x-1.5 lg:gap-x-2.5">
            <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
              Zach Meyer
            </h2>
            <HiCheckBadge className="h-5 w-5 text-primary lg:h-7 lg:w-7" />
          </div>
          <div className="flex items-center text-xs text-muted-foreground/80 md:text-sm">
            <p>@zach</p> <div className="inline-flex px-1">·</div>
            <p>zach@ordstr.com</p>
          </div>
          <div className="pt-1 md:pt-2">
            <p className="line-clamp-3 text-xs text-muted-foreground md:text-sm">
              This is my bio. You should check it out now.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[800px] space-y-6">
        <div className="flex max-w-2xl flex-col gap-5">
          {demo.map((e) => (
            <SubscriptionCard {...e} />
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