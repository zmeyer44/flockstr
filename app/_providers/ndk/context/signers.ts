"use client";

import { nip19 } from "nostr-tools";
import NDK, {
  NDKNip07Signer,
  NDKNip46Signer,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";

export async function _loginWithSecret(skOrNsec: string) {
  try {
    let privkey = skOrNsec;

    if (privkey.substring(0, 4) === "nsec") {
      privkey = nip19.decode(privkey).data as string;
    }

    const signer = new NDKPrivateKeySigner(privkey);
    return signer.user().then(async (user) => {
      if (user.npub) {
        return {
          user: user,
          npub: user.npub,
          sk: privkey,
          signer: signer,
        };
      }
    });
  } catch (e) {
    throw e;
  }
}

export async function _loginWithNip46(ndk: NDK, token: string, sk?: string) {
  try {
    let localSigner = NDKPrivateKeySigner.generate();
    if (sk) {
      localSigner = new NDKPrivateKeySigner(sk);
    }

    const remoteSigner = new NDKNip46Signer(ndk, token, localSigner);

    return remoteSigner.user().then(async (user) => {
      if (user.npub) {
        await remoteSigner.blockUntilReady();
        return {
          user: user,
          npub: (await remoteSigner.user()).npub,
          sk: localSigner.privateKey,
          token: token,
          remoteSigner: remoteSigner,
          localSigner: localSigner,
        };
      }
    });
  } catch (e) {
    throw e;
  }
}

export async function _loginWithNip07() {
  try {
    const signer = new NDKNip07Signer();
    return signer.user().then(async (user) => {
      if (user.npub) {
        return { user: user, npub: user.npub, signer: signer };
      }
    });
  } catch (e) {
    throw e;
  }
}
