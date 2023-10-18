"use client";

import listsStore from "@/lib/stores/lists";
import { useNDK } from "@/app/_providers/ndk";
import { useState } from "react";
import { NDKList } from "@nostr-dev-kit/ndk";

export default function useLists() {
  const [isLoading, setIsLoading] = useState(false);
  const { lists, setLists, follows } = listsStore();
  const { fetchEvents, ndk } = useNDK();
  async function init(pubkey: string) {
    setIsLoading(true);
    try {
      const listEvents = await fetchEvents({
        kinds: [30001],
        authors: [pubkey],
      });
      setLists(listEvents.map((l) => new NDKList(ndk, l.rawEvent())));
    } catch (err) {
      console.log("error in init", err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    lists,
    isLoading,
    init,
    follows,
  };
}
