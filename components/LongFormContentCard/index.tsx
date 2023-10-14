"use client";
import Image from "next/image";
import Link from "next/link";
import { RiMoreFill } from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";
import {
  HiOutlineHandThumbUp,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineEllipsisHorizontal,
} from "react-icons/hi2";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "../ui/button";

type CreatorCardProps = {
  displayName: string;
  about: string;
  picture: string;
  banner: string;
};

export default function LongFormContentCard() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-4">
        <div className="center gap-x-3">
          <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
            <AvatarImage
              src={
                "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
              }
              alt="user"
            />
            <AvatarFallback className="text-xs">SC</AvatarFallback>
          </Avatar>
          <span className="text-xs uppercase text-muted-foreground">
            Derek Seivers
          </span>
        </div>
        <div className="-mr-1 flex items-center gap-x-1.5 text-xs text-muted-foreground">
          {formatDate(new Date("10-5-23"), "MMM Do")}
          <Button size={"sm"} variant={"ghost"} className="center h-6 w-6 p-0">
            <RiMoreFill className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <CardTitle className="mb-1.5 line-clamp-2 text-lg font-semibold">
          The start of the Nostr revolution
        </CardTitle>
        <CardDescription className="line-clamp-4 text-sm">
          This is the summary of this artilce. Let's hope that it is a good
          article and that it will end up being worth reading. I don't want to
          waste my time on some random other stuff.
        </CardDescription>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button size={"sm"} variant={"ghost"} className="gap-x-1.5 px-2">
                <HiOutlineHandThumbUp className="h-4 w-4" />
              </Button>
              <Button size={"sm"} variant={"ghost"} className="gap-x-1.5 px-2">
                <HiOutlineChatBubbleLeftEllipsis className="h-4 w-4" />
              </Button>
            </div>
            <Button size={"sm"} className="gap-x-1.5">
              <HiOutlineLightningBolt className="h-4 w-4" />
              <span>zap</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
