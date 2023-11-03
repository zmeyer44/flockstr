import Link from "next/link";
import { HiOutlineMapPin, HiCheckBadge, HiOutlineUsers } from "react-icons/hi2";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";
import { getTwoLetters, getNameToShow } from "@/lib/utils";
import { nip19 } from "nostr-tools";

export default function UserRow({ pubkey }: { pubkey: string }) {
  const npub = nip19.npubEncode(pubkey);
  const { profile } = useProfile(pubkey);
  return (
    <li className="flex items-center">
      <Link href={`/${npub}`} className="center group gap-x-3">
        <Avatar className="center h-9 w-9 overflow-hidden rounded-sm bg-muted @md:h-10 @md:w-10">
          <AvatarImage src={profile?.image} alt={profile?.displayName} />
          <AvatarFallback className="text-xs">
            {getTwoLetters({ npub, profile })}
          </AvatarFallback>
        </Avatar>
        {profile?.displayName || profile?.name ? (
          <div className="flex flex-col gap-0">
            <div className="flex items-center gap-1">
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
    </li>
  );
}
