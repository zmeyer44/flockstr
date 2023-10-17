import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HiCheckBadge } from "react-icons/hi2";
import Link from "next/link";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { getTwoLetters, getNameToShow } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileHeaderProps = {
  pubkey: string;
};
export default function ProfileHeader({ pubkey }: ProfileHeaderProps) {
  const { profile } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);
  return (
    <Link href={`/${npub}`} className="center group gap-x-3">
      <Avatar className="center h-9 w-9 overflow-hidden rounded-sm bg-muted @md:h-10 @md:w-10">
        <AvatarImage src={profile?.image} alt={profile?.displayName} />
        <AvatarFallback className="text-xs">
          {getTwoLetters({ npub, profile })}
        </AvatarFallback>
      </Avatar>
      {profile?.displayName || profile?.name ? (
        <div className="flex flex-col gap-0">
          <div className="flex items-center  gap-1">
            <span className="text-sm font-medium text-foreground group-hover:underline">
              {getNameToShow({ npub, profile })}
            </span>
            {!!profile?.nip05 && (
              <HiCheckBadge className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-1">
            {!!profile.nip05 && (
              <span className="text-[11px] text-muted-foreground">
                {profile.nip05}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center  gap-1">
          <span className="text-sm uppercase text-foreground group-hover:underline">
            {getNameToShow({ npub, profile })}
          </span>
          {!!profile?.nip05 && (
            <HiCheckBadge className="h-4 w-4 text-primary" />
          )}
        </div>
      )}
    </Link>
  );
}

export function LoadingProfileHeader() {
  return (
    <div className="center group gap-x-3">
      <Avatar className="center h-9 w-9 overflow-hidden rounded-sm bg-muted @md:h-10 @md:w-10"></Avatar>
      <div className="space-y-1">
        <Skeleton className="h-2.5 w-[70px] bg-muted" />
        <Skeleton className="h-2.5 w-[100px] bg-muted" />
      </div>
    </div>
  );
}
