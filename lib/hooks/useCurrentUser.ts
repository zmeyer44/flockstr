"use client";
import { useEffect } from "react";
import currentUserStore from "@/lib/stores/currentUser";
// import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import useLists from "./useLists";
import useSubscriptions from "./useSubscriptions";
import { type NDKKind } from "@nostr-dev-kit/ndk";
import { webln } from "@getalby/sdk";
const loadNWCUrl = "";
const nwc = new webln.NWC({ nostrWalletConnectUrl: loadNWCUrl });

export default function useCurrentUser() {
  const {
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    follows,
    setFollows,
    addFollow,
    calendars,
    setCalendars,
  } = currentUserStore();
  const { loginWithNip07, loginWithNip46, getProfile, ndk, fetchEvents } =
    useNDK();
  const { init } = useLists();
  const { init: initSubscriptions, mySubscription } = useSubscriptions();

  async function attemptLogin() {
    try {
      const shouldReconnect = localStorage.getItem("shouldReconnect");
      if (!shouldReconnect || typeof window.nostr === "undefined") return;
      const user = await loginWithNip07();
      console.log("Called loginWithNip07");
      if (!user) {
        throw new Error("NO auth");
      }
      const pubkey = nip19.decode(user.npub).data.toString();
      await loginWithPubkey(pubkey);
      void initSubscriptions(pubkey);
      if (typeof window.webln !== "undefined") {
        await window.webln.enable();
      }
      console.log("connected ");
    } catch (err) {
      console.log("Error at attemptLogin", err);
    }
  }

  function logout() {
    localStorage.removeItem("shouldReconnect");
    setCurrentUser(null);
    window.location.reload();
  }
  function handleUpdateUser(userInfo: string) {
    const userObject = UserSchema.safeParse(JSON.parse(userInfo));
    if (!userObject.success) return;
    const parsedData = UserSchema.safeParse({
      ...currentUser,
      ...userObject,
    });
    if (parsedData.success) {
      updateCurrentUser({
        profile: {
          ...parsedData.data,
          displayName: parsedData.data.display_name,
        },
      });
    }
  }

  async function loginWithPubkey(pubkey: string) {
    if (!ndk) return;
    const user = ndk.getUser({ hexpubkey: pubkey });
    console.log("user", user);
    await user.fetchProfile();

    // await db.users.add({
    //   profile: user.profile!,
    //   pubkey: pubkey,
    //   createdAt: unixTimeNowInSeconds(),
    // });
    setCurrentUser(user);
    void init(user.pubkey);
  }

  useEffect(() => {
    if (!currentUser) return;
    console.log("fetching follows & calendar");
    (async () => {
      const following = await currentUser.follows();
      console.log("Follows", following);
      setFollows(following);
      await fetchCalendars();
    })();
  }, [currentUser]);

  async function fetchCalendars() {
    if (!ndk || !currentUser) return;
    const calendars = await ndk.fetchEvents({
      authors: [currentUser.pubkey],
      kinds: [31924 as NDKKind],
    });
    setCalendars(new Set(calendars));
  }

  return {
    currentUser,
    isLoading: false,
    follows,
    setCurrentUser,
    logout,
    updateUser: handleUpdateUser,
    loginWithPubkey,
    attemptLogin,
    initSubscriptions,
    mySubscription,
    addFollow,
    setFollows,
    calendars,
    fetchCalendars,
  };
}
