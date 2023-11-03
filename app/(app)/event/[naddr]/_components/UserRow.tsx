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

const raw = {
  created_at: 1698235988,
  content:
    "Where's the kind 31923 Calendar event for nostr:npub1nstrcu63lzpjkz94djajuz2evrgu2psd66cwgc0gz0c0qazezx0q9urg5l?\n\nnote152vyaf30lj96mc6uyhgj54y6kdvf7y0s2zr5xva96ld338vfuqmsy829u7",
  tags: [
    [
      "e",
      "f4312118cac136538def1caf9b572fbc548b583701b952187f5c60ee49c3963c",
      "",
      "root",
    ],
    ["p", "9c163c7351f8832b08b56cbb2e095960d1c5060dd6b0e461e813f0f07459119e"],
    ["p", "fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52"],
  ],
  kind: 1,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "9b33153e60ad79dfb8b7801285963788583e21c3d0c4ca07054e18af7cbf5176",
  sig: "55af918ad6bc3588bfbaff548c3199e628e606116a8b18d12caf2476a78ce2b65cbb8333aaf80ca350538ad6b6127cdb8ce67050c3ff9b1aa9ab3cf5f71a3581",
};
