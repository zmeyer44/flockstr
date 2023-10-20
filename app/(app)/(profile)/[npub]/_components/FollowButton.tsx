"use client";
import { useState } from "react";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { follow } from "@/lib/actions/create";
import { toast } from "sonner";
import { NDKUser } from "@nostr-dev-kit/ndk";

type FollowButtonProps = {
  pubkey: string;
  follows: Set<NDKUser>;
};

export default function FollowButton({ pubkey, follows }: FollowButtonProps) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (!ndk || !currentUser) return;
    setLoading(true);
    try {
      await follow(ndk, currentUser, pubkey);
      toast.success("Payment Sent!");
    } catch (err) {
      console.log("Error", err);
    }
    setLoading(false);
  }
  if (Array.from(follows).find((i) => i.pubkey === pubkey)) {
    return (
      <Button
        onClick={handleFollow}
        loading={loading}
        variant={"default"}
        className="rounded-sm px-5 max-sm:h-8 max-sm:text-xs"
      >
        Follow
      </Button>
    );
  }
  return null;
}
