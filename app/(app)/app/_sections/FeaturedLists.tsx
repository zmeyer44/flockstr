"use client";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import LiveBadge from "@/components/Badges/LiveBadge";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import VideoCard from "@/components/VideoCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
export default function FeaturedLists() {
  const demo = [
    {
      id: 1,
      title: "BTC Radio",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/51602.original.png?1693358530",
      tags: ["music", "crypto", "art"],
    },
    {
      id: 2,
      title: "The Book of Alpha: NFTs and crypto taking over. Market Talk",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/31095.thumbnail.png?1692203850",
      tags: ["NFTs", "crypto", "art", "trading"],
    },
    {
      id: 3,
      title: "Space Talk: What's Elon up to?",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/40088.original.png?1692206315",
      tags: ["Space"],
    },
    {
      id: 4,
      title: "The Book of Alpha: NFTs and crypto taking over. Market Talk",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/40680.original.png?1692206434",
      tags: ["Market"],
    },
  ];
  return (
    <Section>
      <SectionHeader>
        <div className="center gap-x-2">
          <SectionTitle>Featured Lists</SectionTitle>
        </div>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="sm:md-feed-cols relative flex flex-col gap-3">
        {demo.map((e) => (
          <Card key={e.id} className="max-sm:border-0 max-sm:shadow-none">
            <div className="hidden overflow-hidden rounded-t-md sm:flex">
              <Image
                width={250}
                height={150}
                src={e.picture}
                alt={e.title}
                unoptimized
                className={cn(
                  "h-auto w-auto object-cover transition-all group-hover:scale-105",
                  "aspect-video",
                )}
              />
            </div>
            <CardContent className="flex gap-x-3 p-0 sm:p-3">
              <div className="shrink-0">
                <Avatar className="center h-[60px] w-[60px] overflow-hidden rounded-sm bg-muted sm:h-12 sm:w-12">
                  <AvatarImage
                    src={e.picture}
                    alt="user"
                    className="h-full w-auto max-w-none object-cover"
                  />
                  <AvatarFallback className="text-sm">SC</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-1 justify-between gap-3 max-sm:items-center">
                <div className="flex flex-1 flex-col justify-between">
                  <div className="">
                    <CardTitle className="line-clamp-1 max-sm:text-sm">
                      {e.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      Here is my description of this list that I am offering
                    </CardDescription>
                  </div>
                  <div className="max-sm:hidden">
                    <Badge variant={"outline"}>100 subs</Badge>
                  </div>
                </div>
                <div className="gap-y-1.5 text-right">
                  <div className="max-sm:hidden">
                    <div className="text-sm font-medium">2k sats</div>
                    <div className="text-[10px] text-muted-foreground">
                      /month
                    </div>
                  </div>
                  <Badge variant={"green"} className="">
                    Free
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SectionContent>
    </Section>
  );
}
