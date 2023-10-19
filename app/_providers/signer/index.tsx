"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { findEphemeralSigner } from "@/lib/actions/ephemeral";
import {
  NDKPrivateKeySigner,
  NDKUser,
  type NDKSigner,
  type NDKList,
} from "@nostr-dev-kit/ndk";
import { useNDK } from "../ndk";
import { log } from "@/lib/utils";

export type SignerStoreItem = {
  signer: NDKPrivateKeySigner;
  user: NDKUser;
  saved: boolean;
  title?: string;
  id: string;
};
type SignerItems = Map<string, SignerStoreItem>;

type SignerContextProps = {
  npubSigners: Map<string, NDKSigner>;
  signers: SignerItems;
  getSigner: (list: NDKList) => Promise<SignerStoreItem>;
};
const SignerContext = createContext<SignerContextProps | undefined>(undefined);

export default function SignerProvider({
  children,
}: {
  children?: ReactNode | undefined;
}) {
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const [signers, setSigners] = useState(new Map());
  const npubSigners = useMemo(() => {
    const npubs = new Map<string, NDKSigner>();
    for (const entry of signers) {
      const { user, signer } = entry[1];
      npubs.set(user.npub, signer);
    }
    return npubs;
  }, [signers]);

  async function getDelegatedSignerName(list: NDKList) {
    let name = "";
    console.log("getDelegatedSignerName", list);
    if (!currentUser?.profile) {
      console.log("fetching user profile");
      await currentUser?.fetchProfile();
    }
    name = `${
      currentUser?.profile?.displayName ??
      currentUser?.profile?.name ??
      currentUser?.profile?.nip05 ??
      `${currentUser?.npub.slice(0, 9)}...`
    }'s `;

    return name + list.title ?? "List";
  }

  async function getSigner(list: NDKList): Promise<SignerStoreItem> {
    log("func", "getSigner");
    const id = list.encode();
    log("info", "list ID", id.toString());
    let item = signers.get(id);
    if (item) return item;
    log("info", "NO local signer");

    let signer = await findEphemeralSigner(ndk!, ndk!.signer!, {
      associatedEventNip19: list.encode(),
    });

    if (signer) {
      log("info", `found a signer for list ${list.title}`, signer.toString());
      item = {
        signer: signer!,
        user: await signer.user(),
        saved: true,
        id,
      };
    } else {
      log("info", `no signer found for list ${list.title}`);
      signer = NDKPrivateKeySigner.generate();
      log("info", "generated signer", signer.toString());
      item = {
        signer,
        user: await signer.user(),
        saved: false,
        title: await getDelegatedSignerName(list),
        id,
      };
    }
    item.user.ndk = ndk;
    setSigners((prev) => new Map(prev.set(id, item)));
    return item;
  }

  return (
    <SignerContext.Provider value={{ signers, npubSigners, getSigner }}>
      {children}
    </SignerContext.Provider>
  );
}

export function useSigner() {
  return useContext(SignerContext);
}
