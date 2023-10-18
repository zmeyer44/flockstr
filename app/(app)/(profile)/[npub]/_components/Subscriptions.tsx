import Subscriptions from "@/containers/Subscriptions";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { ReactElement } from "react";
export default function ProfileSubscriptions({ pubkey }: { pubkey: string }) {
  return (
    <div className="sm:md-feed-cols relative flex flex-col gap-3">
      <Subscriptions
        link={true}
        pubkey={pubkey}
        loader={() => (
          <div className="center flex-col gap-y-4 pt-7 text-center">
            <Spinner />
            <p className="font-medium text-primary">
              Fetching Subscriptions...
            </p>
          </div>
        )}
      />
    </div>
  );
}
