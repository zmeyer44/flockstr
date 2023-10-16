import Image from "next/image";
import { cn, formatNumber, getTwoLetters, formatCount } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { RxClock } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { type Event } from "nostr-tools";
import { formatDate } from "@/lib/utils/dates";
import { getTagValues, getTagsValues, getPrice } from "@/lib/nostr/utils";
import { nip19 } from "nostr-tools";
import useProfile from "@/lib/hooks/useProfile";
import { type NDKEvent } from "@nostr-dev-kit/ndk";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type ListCardProps = {
  event: NDKEvent;
  className?: string;
};

export default function ListCard({ className, event: e }: ListCardProps) {
  const event = e.rawEvent() as Event;
  const image = getTagValues("image", event.tags) as string;
  const title =
    getTagValues("title", event.tags) ?? getTagValues("name", event.tags);
  const description = getTagValues("description", event.tags);
  const userCount = getTagsValues("p", event.tags).length;
  const price = getPrice(event.tags);
  const tags = getTagsValues("t", event.tags) as string[];
  const { profile } = useProfile(e.pubkey);
  const npub = nip19.npubEncode(e.pubkey);

  return (
    <Card
      onClick={() => console.log(event.tags)}
      className="max-sm:border-0 max-sm:shadow-none"
    >
      <div className="hidden overflow-hidden rounded-t-md sm:flex">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            width={250}
            height={150}
            src={image ?? profile?.banner}
            alt={title ?? ""}
            unoptimized
            className={cn(
              "h-auto w-auto object-cover transition-all group-hover:scale-105",
              "aspect-video",
            )}
          />
        </AspectRatio>
      </div>
      <CardContent className="flex gap-x-3 p-0 sm:p-3">
        <div className="shrink-0">
          <Avatar className="center h-[60px] w-[60px] overflow-hidden rounded-sm bg-muted sm:h-12 sm:w-12">
            <AvatarImage
              src={profile?.image}
              alt="user"
              className="h-full w-auto max-w-none object-cover"
            />
            <AvatarFallback className="text-sm">
              {getTwoLetters({ profile, npub })}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-1 justify-between gap-3 max-sm:items-center">
          <div className="flex flex-1 flex-col justify-between">
            <div className="">
              <CardTitle className="line-clamp-1 max-sm:text-sm">
                {title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                {description}
              </CardDescription>
            </div>
            <div className="max-sm:hidden">
              <Badge variant={"outline"}>{`${userCount} subs`}</Badge>
            </div>
          </div>
          <div className="gap-y-1.5 text-right">
            {/* <div className="max-sm:hidden">
            <div className="text-sm font-medium">2k sats</div>
            <div className="text-[10px] text-muted-foreground">
              /month
            </div>
          </div> */}
            {price ? (
              <>
                <Badge variant={"green"} className="">
                  {`${formatCount(price.asSats)} sats`}
                </Badge>
                {!!price.frequency && (
                  <div className="text-[10px] text-muted-foreground">
                    {`per ${price.frequency}`}
                  </div>
                )}
              </>
            ) : (
              <Badge variant={"green"} className="">
                Free
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export function ListCardLoading({ className }: { className?: string }) {
  return (
    <Card className="max-sm:border-0 max-sm:shadow-none">
      <div className="hidden overflow-hidden rounded-t-md sm:flex">
        <AspectRatio ratio={16 / 9} className="bg-muted"></AspectRatio>
      </div>
      <CardContent className="flex gap-x-3 p-0 sm:p-3">
        <div className="shrink-0">
          <Avatar className="center h-[60px] w-[60px] overflow-hidden rounded-sm bg-muted sm:h-12 sm:w-12"></Avatar>
        </div>
        <div className="flex flex-1 justify-between gap-3 max-sm:items-center">
          <div className="flex flex-1 flex-col justify-between">
            <div className="">
              <CardTitle className="line-clamp-1 max-sm:text-sm">
                <Skeleton className="h-4 w-2/3 bg-muted" />
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs">
                <Skeleton className="h-2 w-1/2 bg-muted" />
                <Skeleton className="h-2 w-1/3 bg-muted" />
                <Skeleton className="h-2 w-2/5 bg-muted" />
              </CardDescription>
            </div>
            <div className="max-sm:hidden">
              <Skeleton className="h-2 w-[30px] bg-muted" />
            </div>
          </div>
          <div className="gap-y-1.5 text-right">
            {/* <div className="max-sm:hidden">
          <div className="text-sm font-medium">2k sats</div>
          <div className="text-[10px] text-muted-foreground">
            /month
          </div>
        </div> */}
            <Skeleton className="h-3 w-[30px] bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
