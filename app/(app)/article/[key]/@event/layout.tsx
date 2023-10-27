"use client";
import { ReactElement, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { getTagAllValues, getTagValues } from "@/lib/nostr/utils";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { getNameToShow, getTwoLetters } from "@/lib/utils";

export default function Layout(props: {
  children: ReactElement;
  params: { key: string };
}) {
  const router = useRouter();
  const { data, type } = nip19.decode(props.params.key);
  const pubkey = type === "nevent" ? data.author ?? "" : "";
  const { profile } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);
  return (
    <div className="relative @container">
      <div className="sticky inset-x-0 top-0 z-10 flex items-center justify-between border-b bg-background pb-4 pt-4">
        <div className="center gap-x-3">
          <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
            <AvatarImage src={profile?.image} alt="user" />
            <AvatarFallback className="text-xs">
              {getTwoLetters({ profile, npub })}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs uppercase text-muted-foreground">
            {getNameToShow({ profile, npub })}
          </span>
        </div>
        <Button
          onClick={() => {
            if (sessionStorage.getItem("RichHistory")) {
              void router.back();
            } else {
              void router.push("/explore");
            }
          }}
          size="icon"
          variant={"outline"}
          className=""
        >
          <RiCloseFill className="h-5 w-5" />
        </Button>
      </div>
      <div className="h-[20px] w-full"></div>
      <div className="mx-auto max-w-2xl">{props.children}</div>
    </div>
  );
}
