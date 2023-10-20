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
};

export default function FollowButton({ pubkey }: FollowButtonProps) {
  const { currentUser, follows, addFollow, setFollows } = useCurrentUser();
  const { ndk } = useNDK();
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (!ndk || !currentUser) return;
    setLoading(true);
    try {
      await follow(ndk, currentUser, pubkey);
      addFollow(new NDKUser({ hexpubkey: pubkey }));
      toast.success("Following!");
    } catch (err) {
      console.log("Error", err);
    }
    setLoading(false);
  }
  async function handleUnfollow() {
    if (!ndk || !currentUser) return;
    setLoading(true);
    try {
      await follow(ndk, currentUser, pubkey, true);
      const newFollows = Array.from(follows).filter((i) => i.pubkey !== pubkey);
      setFollows(new Set(newFollows));
      toast.success("Unfollowed!");
    } catch (err) {
      console.log("Error", err);
    }
    setLoading(false);
  }
  if (!Array.from(follows).find((i) => i.pubkey === pubkey)) {
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
  } else {
    return (
      <Button
        onClick={handleUnfollow}
        loading={loading}
        variant={"outline"}
        className="rounded-sm px-5 max-sm:h-8 max-sm:text-xs"
      >
        Unfollow
      </Button>
    );
  }
}
