"use client";
import CreatorCard from "@/components/CreatorCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import useEvents from "@/lib/hooks/useEvents";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { EXPLORE_CREATORS } from "@/constants/app";
import { getTagValues } from "@/lib/nostr/utils";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";

export default function ExploreCreators() {
  return (
    <section className="relative -mx-5 space-y-4 overflow-x-hidden sm:space-y-6">
      <div className="flex items-center justify-between px-5 max-sm:pr-3">
        <h2 className="font-condensed text-2xl font-bold sm:text-3xl">
          Explore Calendars
        </h2>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <HorizontalCarousel />
    </section>
  );
}

function HorizontalCarousel() {
  const cards = [
    {
      banner:
        "https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage-3.454151b1.jpg&w=640&q=75",
      picture:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      displayName: "Mark Cooper",
      about: "My page is a demo about what i enjoy",
    },
    {
      banner:
        "https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage-4.5c6d0ed6.jpg&w=640&q=75",
      picture:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      displayName: "Jenny Olsen",
      about: "More demo stuff to fill the space",
    },
    {
      banner:
        "https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage-2.3c6c01cf.jpg&w=640&q=75",
      picture:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      displayName: "Kristen Watson",
      about: "random text that looks fairly nice",
    },
    {
      banner:
        "https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage-1.c5d2141c.jpg&w=640&q=75",
      picture:
        "https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar.51a13c67.jpg&w=128&q=75",
      displayName: "Cody Fisher",
      about: "So things aren't clearly manual",
    },
    {
      banner:
        "https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage-5.6c6f2784.jpg&w=640&q=75",
      picture:
        "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      displayName: "Ester Howard",
      about: "here again is more ",
    },
  ];
  return (
    <div className="scrollbar-thumb-rounded-full mr-auto flex min-w-0 max-w-full snap-x snap-mandatory overflow-x-auto pl-5 pr-[50vw] scrollbar-thin sm:pr-[200px]">
      {EXPLORE_CREATORS.map((creator, index) => (
        <div
          key={index}
          className={cn("snap-start pl-2 sm:pl-5", index === 0 && "pl-5")}
        >
          <Creator npub={creator} />
        </div>
      ))}
    </div>
  );
}

function Creator({ npub }: { npub: string }) {
  const pubkey = nip19.decode(npub).data.toString();
  const { profile } = useProfile(pubkey);
  const { events } = useEvents({
    filter: {
      authors: [pubkey],
      kinds: [30023, 9802],
      limit: 10,
    },
  });
  const recentWork = events.map((e) => ({
    id: e.id,
    title:
      getTagValues("title", e.tags) ??
      getTagValues("context", e.tags) ??
      getTagValues("alt", e.tags) ??
      "",
    summary:
      getTagValues("summary", e.tags) ?? getTagValues("r", e.tags) ?? e.content,
    href: `/article/${e.encode()}`,
  }));

  return (
    <CreatorCard
      recentWork={recentWork}
      key={pubkey}
      profile={profile}
      npub={npub}
    />
  );
}
