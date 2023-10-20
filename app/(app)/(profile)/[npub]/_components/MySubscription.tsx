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
  const { fetchEvents } = useNDK();
  const { currentUser, mySubscription, follows } = useCurrentUser();
  const [subscriptionTiers, setSubscriptionTiers] = useState<NDKEvent[]>([]);

  useEffect(() => {
    void handleFetchSubscriptionTiers();
  }, [pubkey]);

  async function handleFetchSubscriptionTiers() {
    try {
      const events = await fetchEvents({
        kinds: [30044 as NDKKind],
        authors: [pubkey],
      });
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
