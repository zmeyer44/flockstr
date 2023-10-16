"use client";
import Image from "next/image";
import Link from "next/link";
import { RiMoreFill } from "react-icons/ri";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import ProfileHeader, { LoadingProfileHeader } from "./ProfileHeader";
import Actions from "./Actions";
import Tags from "./Tags";
import DropDownMenu from "@/components/DropDownMenu";

type OptionLink = {
  href: string;
  type: "link";
};
type OptionButton = {
  onClick: () => void;
  type: "button";
};
type Option = {
  label: string;
} & (OptionLink | OptionButton);

type CreatorCardProps = {
  pubkey?: string;
  contentTags?: string[];
  createdAt?: number;
  children: ReactNode;
  actionOptions?: Option[];
};

export default function Container({
  children,
  createdAt,
  contentTags,
  pubkey,
  actionOptions = [],
}: CreatorCardProps) {
  return (
    <Card className="relative flex h-full w-full flex-col overflow-hidden @container">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-4">
        {pubkey ? <ProfileHeader pubkey={pubkey} /> : <LoadingProfileHeader />}

        <div className="-mr-1 flex items-center gap-x-1.5 text-xs text-muted-foreground">
          {!!createdAt &&
            formatDate(new Date(createdAt * 1000), "MMM Do, h:m a")}
          <DropDownMenu options={actionOptions}>
            <Button
              size={"sm"}
              variant={"ghost"}
              className="center h-6 w-6 p-0"
            >
              <RiMoreFill className="h-4 w-4" />
            </Button>
          </DropDownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex grow flex-col px-4 pb-3">
        {children}
        <div className="mt-auto">
          {!!contentTags?.length && (
            <div className="mb-2.5 mt-1 max-h-[52px] overflow-hidden">
              <Tags tags={contentTags} />
            </div>
          )}
          <div className="border-t">
            <Actions />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
