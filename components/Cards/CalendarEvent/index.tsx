"use client";
import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RxClock, RxCalendar } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/dates";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import {
  getTagAllValues,
  getTagValues,
  getTagsValues,
} from "@/lib/nostr/utils";
import useProfile from "@/lib/hooks/useProfile";
import SmallProfileLine from "@/components/ProfileContainers/SmallProfileLine";

type CalendarEventCardProps = {
  event: NostrEvent;
  className?: string;
};

export default function CalendarEventCard({
  className,
  event,
}: CalendarEventCardProps) {
  const { pubkey, tags } = event;
  const { profile } = useProfile(pubkey);

  const title = getTagValues("name", tags) || "Untitled";
  const image =
    getTagValues("image", tags) ??
    getTagValues("picture", tags) ??
    getTagValues("banner", tags) ??
    profile?.banner;

  const description = event.content;
  const startDate = getTagValues("start", tags)
    ? new Date(parseInt(getTagValues("start", tags) as string) * 1000)
    : null;
  const endDate = getTagValues("end", tags)
    ? new Date(parseInt(getTagValues("end", tags) as string) * 1000)
    : null;
  const getLocation = () => {
    let temp = getTagAllValues("location", tags);
    if (temp[0]) {
      return temp;
    }
    return getTagAllValues("address", tags);
  };
  const location = getLocation();

  const users = getTagsValues("p", tags);
  const hashtags = getTagsValues("t", tags);
  return (
    <div
      className={cn(
        "group flex h-full flex-col rounded-[16px] p-2 hover:bg-muted",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={image ?? ""}
            alt={title}
            width={250}
            height={150}
            unoptimized
            className={cn(
              "h-auto w-auto min-w-full object-cover transition-all group-hover:scale-105",
              "aspect-video",
            )}
          />
        </AspectRatio>
      </div>
      <div className="mt-3 flex-1 space-y-2 text-base">
        <h3 className="line-clamp-2 font-semibold leading-5">{title}</h3>
        <div className="flex flex-col items-start gap-y-1">
          <div className="flex flex-col items-start gap-x-3 gap-y-1">
            {!!startDate && (
              <>
                {startDate.getDay() === endDate?.getDay() ? (
                  <div className="center shrink-0 gap-x-1 text-xs text-muted-foreground">
                    <RxCalendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(startDate, "ddd, MMM D")}</span>
                  </div>
                ) : (
                  <div className="center shrink-0 gap-x-1 text-xs text-muted-foreground">
                    <RxCalendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(startDate, "ddd, MMM D")}</span>
                    {!!endDate && (
                      <>
                        {" "}
                        <span>-</span>{" "}
                        <span>{formatDate(endDate, "MMM D")}</span>
                      </>
                    )}
                  </div>
                )}

                <div className="center shrink-0 gap-x-1 text-xs text-muted-foreground">
                  <RxClock className="h-4 w-4 text-primary" />
                  <span>{formatDate(startDate, "h:mm a")}</span>
                  {!!endDate && (
                    <>
                      {" "}
                      <span>-</span>{" "}
                      <span>{formatDate(endDate, "h:mm a")}</span>
                    </>
                  )}
                </div>
              </>
            )}
            {!!users.length && (
              <div className="center gap-x-1 text-xs text-muted-foreground">
                <HiOutlineUsers className="h-4 w-4 text-primary" />
                <span>{formatNumber(users.length)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-1 flex">
        <SmallProfileLine pubkey={pubkey} />
      </div>
    </div>
  );
}
export function CardLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group pointer-events-none flex flex-col space-y-3 rounded-[16px] p-2",
        className,
      )}
    >
      <div className="overflow-hidden rounded-md">
        <AspectRatio ratio={16 / 9} className="bg-muted"></AspectRatio>
      </div>
      <div className="flex-1 space-y-2 text-base">
        <Skeleton className="mb-2 h-4 w-1/3 bg-muted" />
        <div className="flex flex-col items-start">
          <div className="center gap-x-1 text-xs text-muted-foreground">
            <Skeleton className="h-3 w-3 bg-muted" />
            <Skeleton className="h-3 w-[50px] bg-muted" />
          </div>
        </div>
      </div>
      <div className="-mt-1 flex flex-wrap gap-2 overflow-x-hidden">
        <Skeleton className="h-2 w-[50px] bg-muted" />
        <Skeleton className="h-2 w-[40px] bg-muted" />
        <Skeleton className="h-2 w-[30px] bg-muted" />
      </div>
    </div>
  );
}
