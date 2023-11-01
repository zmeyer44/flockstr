import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { getLettersPlain } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HiCalendarDays } from "react-icons/hi2";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";

type SmallLineInfoProps = {
  event: NDKEvent;
};
export default function SmallLineInfo({ event }: SmallLineInfoProps) {
  const image = getTagValues("image", event.tags);
  const name = getTagValues("name", event.tags);
  return (
    <Link
      href={`/calendar/${event.encode()}`}
      className="center group gap-x-2 rounded-sm rounded-r-full bg-background/50 pr-1 text-muted-foreground hover:shadow"
    >
      <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.25rem] bg-muted @sm:h-[18px] @sm:w-[18px]">
        <AvatarImage src={image} alt={name ?? "event"} />
        <AvatarFallback className="text-[8px]">
          {getLettersPlain(name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-1">
        <span className="text-[12px] ">{name ?? "Calendar"}</span>
        <HiCalendarDays className="h-3 w-3 text-primary" />
      </div>
    </Link>
  );
}

export function LoadingProfileInfo() {
  return (
    <div className="center group gap-x-1">
      <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.25rem] bg-muted @sm:h-[18px] @sm:w-[18px]"></Avatar>
      <div className="space-y-1">
        <Skeleton className="h-2 w-[70px] bg-muted" />
      </div>
    </div>
  );
}
