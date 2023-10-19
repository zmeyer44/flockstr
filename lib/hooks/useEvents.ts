"use client";

import { useState, useEffect } from "react";
import { useNDK } from "@/app/_providers/ndk";
import {
  NDKEvent,
  type NDKFilter,
  type NDKSubscription,
} from "@nostr-dev-kit/ndk";
import { log } from "@/lib/utils";
import { uniqBy } from "ramda";
import { Event as NostrEvent } from "nostr-tools";

const debug = true;
type OnEventFunc = (event: NostrEvent) => void;
type OnDoneFunc = () => void;
type OnSubscribeFunc = (sub: NDKSubscription) => void;
type UseEventsProps = {
  filter: NDKFilter;
  enabled?: boolean;
  eventFilter?: (e: NDKEvent) => boolean;
};

export default function useEvents({
  filter,
  enabled = true,
  eventFilter = () => true,
}: UseEventsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [sub, setSub] = useState<NDKSubscription | undefined>(undefined);
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [eventIds, setEventIds] = useState<Set<string>>(new Set());
  let onEventCallback: null | OnEventFunc = null;
  let onSubscribeCallback: null | OnSubscribeFunc = null;
  let onDoneCallback: null | OnDoneFunc = null;
  const { ndk } = useNDK();

  useEffect(() => {
    if (!enabled || !ndk) return;
    void init();
    return () => {
      console.log("STOPPING", sub);
      if (sub) {
        sub.stop();
      }
    };
  }, [enabled, ndk]);

  async function init() {
    console.log("Running init");
    setIsLoading(true);
    try {
      const sub = ndk!.subscribe(
        { limit: 50, ...filter },
        { closeOnEose: false },
      );
      setSub(sub);
      onSubscribeCallback?.(sub);
      sub.on("event", (e, r) => {
        if (eventIds.has(e.id)) {
          return;
        }
        if (eventFilter(e)) {
          setEvents((prevEvents) => {
            const events = uniqBy((a) => a.id, [...prevEvents, e]);
            return events.sort((a, b) => b.created_at - a.created_at);
          });
          setEventIds((prev) => prev.add(e.id));
        }
      });
    } catch (err) {
      log("error", `❌ nostr (${err})`);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    events,
    onEvent: (_onEventCallback: OnEventFunc) => {
      if (_onEventCallback) {
        onEventCallback = _onEventCallback;
      }
    },
    onDone: (_onDoneCallback: OnDoneFunc) => {
      if (_onDoneCallback) {
        onDoneCallback = _onDoneCallback;
      }
    },
    onSubscribe: (_onSubscribeCallback: OnSubscribeFunc) => {
      if (_onSubscribeCallback) {
        onSubscribeCallback = _onSubscribeCallback;
      }
    },
  };
}
