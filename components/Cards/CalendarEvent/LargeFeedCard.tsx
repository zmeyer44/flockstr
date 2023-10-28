import { formatDate, fromUnix } from "@/lib/utils/dates";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SmallProfileLine from "@/components/ProfileContainers/SmallProfileLine";
import AvatarStack from "@/components/ProfileContainers/AvatarStack";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import {
  getTagValues,
  getTagAllValues,
  getTagsValues,
} from "@/lib/nostr/utils";
import { HiOutlineMapPin, HiOutlineUserCircle } from "react-icons/hi2";
import { RxClock, RxCalendar } from "react-icons/rx";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type LargeFeedCardProps = {
  event: NDKEvent;
};

export default function LargeFeedCard({ event }: LargeFeedCardProps) {
  const { tags, pubkey, content } = event;
  const image = getTagValues("image", tags);
  const location =
    getTagValues("location", tags) ?? getTagValues("address", tags);
  const users = getTagsValues("p", tags).filter(Boolean);
  console.log("Users", users);
  const startDate = getTagValues("start", tags)
    ? new Date(parseInt(getTagValues("start", tags) as string) * 1000)
    : null;
  const endDate = getTagValues("end", tags)
    ? new Date(parseInt(getTagValues("end", tags) as string) * 1000)
    : null;

  return (
    <Card className="relative flex justify-between gap-x-4 rounded-[1rem] bg-muted p-[0.5rem]">
      <CardHeader className="w-3/5 justify-between p-0 pr-5">
        <div className="">
          <div className="flex">
            <SmallProfileLine pubkey={pubkey} />
          </div>
          <div className="pl-3">
            <CardTitle className="mt-3 line-clamp-2 text-xl leading-6">
              {getTagValues("name", tags)}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-4 text-[13px] leading-5">
              {content}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-x-4 pl-2">
          {!!users.length && (
            <div className="flex shrink-0 items-center gap-x-1.5">
              <HiOutlineUserCircle className="h-4 w-4 text-primary" />
              <AvatarStack
                pubkeys={users.slice(0, 4)}
                className="z-0 h-5 w-5 text-[9px]"
                remaining={users.length - 4 > 2 ? users.length - 4 : 0}
              />
            </div>
          )}
          {!!startDate && (
            <div className="center shrink-0 gap-x-1.5">
              <RxClock className="h-4 w-4 text-primary" />
              <p className="line-clamp-1 text-xs text-muted-foreground">
                <span>{formatDate(startDate, "h:mm a")}</span>
                {!!endDate && (
                  <>
                    {" "}
                    <span>-</span> <span>{formatDate(endDate, "h:mm a")}</span>
                  </>
                )}
              </p>
            </div>
          )}
          {!!location && (
            <div className="flex items-center gap-x-1.5">
              <HiOutlineMapPin className="h-4 w-4 shrink-0 text-primary" />
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {location}
              </p>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col justify-end self-start pl-2 pt-2">
          <div className="flex w-3/4 items-center justify-stretch gap-3">
            <Button className="flex-1">RSVP</Button>
            <Link href={`/event/${event.encode()}`}>
              <Button variant={"outline"} className="flex-1">
                Details
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <div className="absolute inset-y-[0.5rem] right-[0.5rem] w-2/5 overflow-hidden rounded-[0.5rem]">
        {image ? (
          <Image
            src={image}
            unoptimized
            alt="Image"
            fill
            className={cn(
              "h-full max-h-[150px] rounded-[0.5rem] object-cover object-center max-sm:max-h-[100px]",
            )}
          />
        ) : (
          <div className="h-[100px] w-full rounded-[0.5rem] bg-gradient-to-b from-primary/50"></div>
        )}
      </div>
    </Card>
  );
}

export function LoadingCard() {
  return (
    <Card className="relative flex justify-between gap-x-4 rounded-[1rem] bg-muted p-[0.5rem]">
      <CardHeader className="w-3/5 justify-between p-0 pr-5">
        <div className="">
          <div className="flex gap-x-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-[50px]" />
          </div>
          <div className="pl-3">
            <Skeleton className="mt-3  h-5 w-[220px]" />
            <div className="mt-2 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3.5 w-3/5" />
              <Skeleton className="h-3.5 w-1/4" />
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-x-4 pl-2">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-[50px]" />
          </div>
        </div>
        <div className="flex w-full flex-col justify-end self-start pl-2 pt-2">
          <div className="flex w-3/4 items-center justify-stretch gap-3">
            <Skeleton className="h-8 w-1/3 rounded-md" />
            <Skeleton className="h-8 w-1/3 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <div className="absolute inset-y-[0.5rem] right-[0.5rem] w-2/5 overflow-hidden rounded-[0.5rem]">
        <AspectRatio
          ratio={16 / 9}
          className="w-full rounded-[0.5rem] bg-primary/20"
        ></AspectRatio>
      </div>
    </Card>
  );
}
