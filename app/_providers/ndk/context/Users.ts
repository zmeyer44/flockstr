"use client";

import { useRef, useState } from "react";
import NDK, { NDKUser } from "@nostr-dev-kit/ndk";

export const Users = (ndk: NDK | undefined) => {
  const [users, setUsers] = useState<{ [id: string]: NDKUser }>({});
  const refUsers = useRef<{ [id: string]: NDKUser }>({});

  async function fetchUser(id: string) {
    if (ndk == undefined) {
      return;
    }

    if (refUsers.current[id]) {
      return;
    }

    refUsers.current = {
      ...refUsers.current,
      [id]: NDKUser.prototype,
    };

    let user;

    if (id.startsWith("npub")) {
      user = ndk.getUser({
        npub: id,
      });
    } else {
      user = ndk.getUser({
        hexpubkey: id,
      });
    }

    await user.fetchProfile();

    if (user.profile) {
      refUsers.current = {
        ...refUsers.current,
        [id]: user,
      };
      setUsers(refUsers.current);
    }
  }

  function getUser(id: string) {
    if (users[id]) {
      return users[id];
    } else {
      fetchUser(id);
    }
    return NDKUser.prototype;
  }

  function getProfile(id: string) {
    if (users[id]) {
      return users[id].profile!;
    } else {
      fetchUser(id);
    }
    return {};
  }

  return {
    getUser,
    getProfile,
  };
};
