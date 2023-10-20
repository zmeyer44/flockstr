import { create } from "zustand";
import { type NDKList } from "@nostr-dev-kit/ndk";

interface SubscriptionsState {
  mySubscription: NDKList | undefined;
  setMySubscription: (sub: NDKList) => void;
}

const subscriptionsStore = create<SubscriptionsState>()((set) => ({
  mySubscription: undefined,
  setMySubscription: (sub) =>
    set((state) => ({ ...state, mySubscription: sub })),
}));

export default subscriptionsStore;
