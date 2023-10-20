"use client";

import subscriptionsStore from "@/lib/stores/subscriptions";
import { useNDK } from "@/app/_providers/ndk";
import { useState } from "react";
import { NDKList, NDKKind } from "@nostr-dev-kit/ndk";

export default function useSubscriptions() {
  const [isLoading, setIsLoading] = useState(false);
  const { mySubscription, setMySubscription } = subscriptionsStore();
  const { fetchEvents, ndk } = useNDK();
  async function init(pubkey: string) {
    setIsLoading(true);
    try {
      const subscriptionLists = await fetchEvents({
        kinds: [30044 as NDKKind],
        authors: [pubkey],
      });
      if (subscriptionLists[0]) {
        setMySubscription(new NDKList(ndk, subscriptionLists[0].rawEvent()));
      }
    } catch (err) {
      console.log("error in init", err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    setMySubscription,
    isLoading,
    init,
    mySubscription,
  };
}
