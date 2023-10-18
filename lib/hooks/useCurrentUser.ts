"use client";

import currentUserStore from "@/lib/stores/currentUser";
// import useEvents from "@/lib/hooks/useEvents";
import { UserSchema } from "@/types";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import useLists from "./useLists";
export default function useCurrentUser() {
  const {
    currentUser,
    setCurrentUser,
    setFollows,
    updateCurrentUser,
    follows,
  } = currentUserStore();
  const { loginWithNip07, getProfile, ndk } = useNDK();
  const { init } = useLists();
  async function attemptLogin() {
    try {
      const shouldReconnect = localStorage.getItem("shouldReconnect");
      if (!shouldReconnect || typeof window.nostr === "undefined") return;
      const user = await loginWithNip07();
      if (!user) {
        throw new Error("NO auth");
      }
      console.log("LOGIN", user);
      await loginWithPubkey(nip19.decode(user.npub).data.toString());
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
    setCurrentUser(user);
    void init(user.pubkey);
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
  };
}
