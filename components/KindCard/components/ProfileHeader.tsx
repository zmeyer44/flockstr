import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { HiCheckBadge } from "react-icons/hi2";
import Link from "next/link";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { getTwoLetters, getNameToShow } from "@/lib/utils";

type ProfileHeaderProps = {
  pubkey: string;
};
export default function ProfileHeader({ pubkey }: ProfileHeaderProps) {
  const { profile } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);
  return (
    <Link href={`/${npub}`} className="center group gap-x-3">
      <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
        <AvatarImage src={profile?.image} alt={profile?.displayName} />
        <AvatarFallback className="text-xs">
          {getTwoLetters({ npub, profile })}
        </AvatarFallback>
      </Avatar>
      <div className="center 5 gap-1">
        <span className="text-xs uppercase text-muted-foreground group-hover:underline">
          {getNameToShow({ npub, profile })}
        </span>
        {!!profile?.nip05 && <HiCheckBadge className="h-4 w-4 text-primary" />}
      </div>
    </Link>
  );
}
