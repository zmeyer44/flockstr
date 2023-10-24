import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { getTwoLetters, getNameToShow } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HiMiniChevronRight, HiCheckBadge } from "react-icons/hi2";

type ProfileInfoProps = {
  pubkey: string;
};
export default function ProfileInfo({ pubkey }: ProfileInfoProps) {
  const { profile } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);
  return (
    <Link
      href={`/${npub}`}
      className="center group gap-x-2 rounded-sm rounded-r-full border bg-background/50 pl-0.5 pr-1 text-muted-foreground hover:shadow"
    >
      <Avatar className="center h-[16px] w-[16px] overflow-hidden rounded-[.25rem] bg-muted @sm:h-[18px] @sm:w-[18px]">
        <AvatarImage src={profile?.image} alt={profile?.displayName} />
        <AvatarFallback className="text-[8px]">
          {getTwoLetters({ npub, profile })}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1">
        <span className="text-[14px] ">{getNameToShow({ npub, profile })}</span>
        {!!profile?.nip05 && <HiCheckBadge className="h-3 w-3 text-primary" />}
      </div>
      <HiMiniChevronRight className="h-4 w-4" />
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
