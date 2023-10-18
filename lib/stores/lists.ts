import { create } from "zustand";
import { type NDKList } from "@nostr-dev-kit/ndk";

interface CurrentUserState {
  lists: NDKList[];
  follows: string[];
  setLists: (lists: NDKList[]) => void;
  setFollows: (follows: string[]) => void;
}

const listsStore = create<CurrentUserState>()((set) => ({
  lists: [],
  follows: [],
  setLists: (lists) => set((state) => ({ ...state, lists: lists })),
  setFollows: (follows) => set((state) => ({ ...state, follows: follows })),
}));

export default listsStore;
