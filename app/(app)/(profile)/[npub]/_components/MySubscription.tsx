import { useEffect, useState } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { type NDKKind, type NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagsValues } from "@/lib/nostr/utils";

type MySubscription = {
  pubkey: string;
};

export default function MySubscription({ pubkey }: MySubscription) {
  const { ndk, fetchEvents } = useNDK();
  const { currentUser, mySubscription, follows } = useCurrentUser();
  const [subscriptionTiers, setSubscriptionTiers] = useState<NDKEvent[]>([]);

  useEffect(() => {
    if (ndk) {
      void handleFetchSubscriptionTiers();
    }
  }, [pubkey, ndk]);

  async function handleFetchSubscriptionTiers() {
    try {
      console.log("FETCHING", pubkey);
      const events = await fetchEvents({
        kinds: [30044 as NDKKind],
        authors: [pubkey],
      });
      console.log("events", events);

      setSubscriptionTiers(events);
    } catch (err) {
      console.log("error", err);
    }
  }
  if (!subscriptionTiers.length) return null;
  return (
    <>
      {subscriptionTiers.map((e) => {
        const isMember =
          currentUser &&
          getTagsValues("p", e.tags).includes(currentUser.pubkey);
        if (isMember) return null;
        return <SubscriptionCard key={e.id} event={e} />;
      })}
    </>
  );
}
