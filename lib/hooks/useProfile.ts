"use client";
import { useEffect, useState, useRef } from "react";
import { nip19 } from "nostr-tools";
import { NOSTR_BECH32_REGEXP } from "@/lib/nostr/utils";
import { useNDK } from "@/app/_providers/ndk";
import { type NDKUserProfile } from "@nostr-dev-kit/ndk";

export default function useProfile(key: string) {
  const { ndk, getProfile } = useNDK();

  useEffect(() => {
    if (!ndk) return;
    if (NOSTR_BECH32_REGEXP.test(key)) {
      key = nip19.decode(key).data.toString();
    }
    return () => {
      if (ndk) {
        void ndk.getUser({ hexpubkey: key }).fetchProfile();
      }
    };
  }, [key, ndk]);

  return { profile: getProfile(key) };
}
