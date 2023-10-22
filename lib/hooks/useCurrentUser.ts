"use client";
import { useEffect } from "react";
import currentUserStore from "@/lib/stores/currentUser";
// import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import useLists from "./useLists";
import useSubscriptions from "./useSubscriptions";
import { db } from "@nostr-dev-kit/ndk-cache-dexie";
import { unixTimeNowInSeconds } from "../nostr/dates";

export default function useCurrentUser() {
  const {
    currentUser,
    setCurrentUser,
    updateCurrentUser,
    follows,
    setFollows,
    addFollow,
  } = currentUserStore();
  const { loginWithNip07, getProfile, ndk, fetchEvents } = useNDK();
  const { init } = useLists();
  const { init: initSubscriptions, mySubscription } = useSubscriptions();

  async function attemptLogin() {
    try {
      const shouldReconnect = localStorage.getItem("shouldReconnect");
      if (!shouldReconnect || typeof window.nostr === "undefined") return;
      const user = await loginWithNip07();
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
    console.log("fetching follows");
    (async () => {
      const following = await currentUser.follows();
      console.log("Follows", following);
      setFollows(following);
    })();
  }, [currentUser]);

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
  };
}
