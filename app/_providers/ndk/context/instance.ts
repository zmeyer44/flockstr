"use client";
import { useEffect, useRef, useState } from "react";
import NDK, {
  NDKEvent,
  NDKFilter,
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
  type NDKCacheAdapter,
} from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";

export default function NDKInstance(explicitRelayUrls: string[]) {
  const loaded = useRef(false);

  const [ndk, _setNDK] = useState<NDK | undefined>(undefined);
  const [signer, _setSigner] = useState<
    NDKPrivateKeySigner | NDKNip46Signer | NDKNip07Signer | undefined
  >(undefined);

  // TODO: fully support NIP-11
  async function getExplicitRelays() {
    try {
      // get relays
      const relays = explicitRelayUrls;
      const onlineRelays = new Set(relays);

      for (const relay of relays) {
        try {
          const url = new URL(relay);
          const res = await fetch(`https://${url.hostname}`, {
            method: "GET",
            headers: {
              Accept: "application/nostr+json",
            },
          });

          if (!res.ok) {
            console.info(`${relay} is not working, skipping...`);
            onlineRelays.delete(relay);
          }
        } catch {
          console.warn(`${relay} is not working, skipping...`);
          onlineRelays.delete(relay);
        }
      }

      // return all online relays
      return [...onlineRelays];
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    async function load() {
      if (ndk === undefined && loaded.current === false) {
        loaded.current = true;
        await loadNdk();
      }
    }
    load();
  }, []);

  async function loadNdk(
    signer?: NDKPrivateKeySigner | NDKNip46Signer | NDKNip07Signer,
  ) {
    const explicitRelayUrls = await getExplicitRelays();
    const dexieAdapter = new NDKCacheAdapterDexie({
      dbName: "flockstr-ndkcache",
    });
    const ndkInstance = new NDK({
      explicitRelayUrls,
      signer,
      cacheAdapter: dexieAdapter as unknown as NDKCacheAdapter,
    });
    if (process.env.NODE_ENV === "development") {
      ndkInstance.pool.on("connect", () => console.log("✅ connected"));
      ndkInstance.pool.on("disconnect", () => console.log("❌ disconnected"));
    }

    if (signer) {
      _setSigner(signer);
    }

    try {
      await ndkInstance.connect();
      ndkInstance.signer = signer;
      _setNDK(ndkInstance);
    } catch (error) {
      console.error("ERROR loading NDK NDKInstance", error);
    }
  }

  async function setSigner(
    signer: NDKPrivateKeySigner | NDKNip46Signer | NDKNip07Signer,
  ) {
    console.log("SetSigner caled");
    loadNdk(signer);
  }

  async function fetchEvents(filter: NDKFilter): Promise<NDKEvent[]> {
    if (ndk === undefined) return [];

    return new Promise((resolve) => {
      const events: Map<string, NDKEvent> = new Map();

      const relaySetSubscription = ndk.subscribe(filter, {
        closeOnEose: true,
      });

      relaySetSubscription.on("event", (event: NDKEvent) => {
        event.ndk = ndk;
        events.set(event.tagId(), event);
      });

      relaySetSubscription.on("eose", () => {
        setTimeout(() => resolve(Array.from(new Set(events.values()))), 3000);
      });
    });
  }

  async function signPublishEvent(
    event: NDKEvent,
    params: { repost: boolean; publish: boolean } | undefined = {
      repost: false,
      publish: true,
    },
  ) {
    if (ndk === undefined) return;
    event.ndk = ndk;
    if (params.repost) {
      await event.repost();
    } else {
      await event.sign();
    }
    if (params.publish) {
      await event.publish();
    }
    return event;
  }

  return {
    ndk,
    signer,
    loadNdk,
    setSigner,
    fetchEvents,
    signPublishEvent,
  };
}
