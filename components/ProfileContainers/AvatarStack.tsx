"use client";
import { cn, formatCount, getTwoLetters } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";

type AvatarStackProps = {
  pubkeys: string[];
  remaining?: number;
  className?: string;
};

const zIndexes = ["z-50", "z-40", "z-30", "z-20", "z-10", "z-0"];

export default function AvatarStack({
  pubkeys,
  className,
  remaining,
}: AvatarStackProps) {
  return (
    <div className="isolate flex -space-x-2 overflow-hidden py-[2px]">
      {pubkeys.map((p, idx) => {
        if (p) {
          return (
            <User key={p} pubkey={p} className={cn(zIndexes[idx], className)} />
          );
        }
      })}
      {!!remaining && (
        <Avatar
          className={cn(
            "relative inline-block h-8 w-8 rounded-full text-xs ring-2 ring-background",
            className,
            "z-0",
          )}
        >
          <AvatarFallback className="bg-muted font-semibold text-primary">{`+${formatCount(
            remaining,
          )}`}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function User({ pubkey, className }: { pubkey: string; className: string }) {
  const { profile, npub } = useProfile(pubkey);
  // const npub = profilenip19.npubEncode(pubkey);

  return (
    <Avatar
      className={cn(
        "relative inline-block h-8 w-8 rounded-full ring-2 ring-background",
        className,
      )}
    >
      <AvatarImage src={profile?.image} />
      <AvatarFallback>{getTwoLetters({ npub, profile })}</AvatarFallback>
    </Avatar>
  );
}
