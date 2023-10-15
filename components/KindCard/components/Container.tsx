"use client";
import Image from "next/image";
import Link from "next/link";
import { RiMoreFill } from "react-icons/ri";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import ProfileHeader from "./ProfileHeader";
import Actions from "./Actions";
import Tags from "./Tags";
import { type Event } from "nostr-tools";

type CreatorCardProps = {
  contentTags?: string[];
  children: ReactNode;
};

export default function Container({ children, contentTags }: CreatorCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-4">
        <ProfileHeader />
        <div className="-mr-1 flex items-center gap-x-1.5 text-xs text-muted-foreground">
          {formatDate(new Date("10-5-23"), "MMM Do")}
          <Button size={"sm"} variant={"ghost"} className="center h-6 w-6 p-0">
            <RiMoreFill className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        {children}
        {!!contentTags?.length && (
          <div className="-mb-2 mt-1 max-h-[52px] overflow-hidden">
            <Tags tags={contentTags} />
          </div>
        )}
        <Actions />
      </CardContent>
    </Card>
  );
}