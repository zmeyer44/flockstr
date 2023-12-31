import { create } from "zustand";
import { NDKEvent, type NDKUser } from "@nostr-dev-kit/ndk";

type Settings = {};

interface CurrentUserState {
  currentUser: NDKUser | null;
  follows: Set<NDKUser>;
  calendars: Set<NDKEvent>;
  setCalendars: (calendars: Set<NDKEvent>) => void;
  settings: Settings;
  setCurrentUser: (user: NDKUser | null) => void;
  updateCurrentUser: (user: Partial<NDKUser>) => void;
  setFollows: (follows: Set<NDKUser>) => void;
  addFollow: (follow: NDKUser) => void;
}

const currentUserStore = create<CurrentUserState>()((set) => ({
  currentUser: null,
  follows: new Set(),
  calendars: new Set(),
  settings: {},
  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
  updateCurrentUser: (user) =>
    set((state) => ({
      ...state,
      currentUser: { ...state.currentUser, ...user } as NDKUser,
    })),
  setFollows: (follows) => set((state) => ({ ...state, follows: follows })),
  setCalendars: (calendars) =>
    set((state) => ({ ...state, calendars: calendars })),
  addFollow: (follow) =>
    set((state) => ({ ...state, follows: new Set(state.follows).add(follow) })),
}));

export default currentUserStore;
