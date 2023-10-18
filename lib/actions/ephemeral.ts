import { type Event as NostrEvent } from "nostr-tools";
import NDK, {
  NDKEvent,
  NDKPrivateKeySigner,
  type NDKTag,
  type NDKFilter,
  type NDKSigner,
  type NDKUserProfile,
} from "@nostr-dev-kit/ndk";
import { getHashedKeyName } from "@/lib/nostr";
import { z } from "zod";
const SignerSchema = z.object({
  key: z.string(),
});

interface IFindEphemeralSignerLookups {
  name?: string;
  associatedEventNip19?: string;
}

/**
 * Finds a named ephemeral signer from a self-DM.
 */
export async function findEphemeralSigner(
  ndk: NDK,
  mainSigner: NDKSigner,
  opts: IFindEphemeralSignerLookups,
): Promise<NDKPrivateKeySigner | undefined> {
  const filter: NDKFilter = { kinds: [2600 as number] };

  if (opts.name) {
    const hashedName = await getHashedKeyName(opts.name);
    filter["#e"] = [hashedName];
  } else if (opts.associatedEventNip19) {
    const hashedEventReference = await getHashedKeyName(
      opts.associatedEventNip19,
    );
    filter["#e"] = [hashedEventReference];
  }
  console.log("filter", filter);
  const event = await ndk.fetchEvent(filter);

  if (event) {
    const decryptEventFunction = async (event: NDKEvent) => {
      await event.decrypt(await mainSigner.user());

      const content = SignerSchema.parse(JSON.parse(event.content));
      return new NDKPrivateKeySigner(content.key as string);
    };

    const promise = new Promise<NDKPrivateKeySigner>((resolve, reject) => {
      let decryptionAttempts = 0;
      try {
        decryptionAttempts++;
        resolve(decryptEventFunction(event));
      } catch (e) {
        if (decryptionAttempts > 5) {
          console.error(
            `Failed to decrypt ephemeral signer event after ${decryptionAttempts} attempts.`,
          );
          reject(e);
          return;
        }
        setTimeout(() => {
          decryptEventFunction(event);
        }, 1000 * Math.random());
      }
    });

    return promise;
  }
}

interface ISaveOpts {
  associatedEvent?: NDKEvent;
  name?: string;
  metadata?: object;
  keyProfile?: NDKUserProfile;
  mainSigner?: NDKSigner;
}
type EphemeralKeyEventContent = {
  key: string;
  event?: string;
  version: string;
  metadata?: object;
};
function generateContent(
  targetSigner: NDKPrivateKeySigner,
  opts: ISaveOpts = {},
) {
  const content: EphemeralKeyEventContent = {
    key: targetSigner.privateKey!,
    version: "v1",
    ...opts.metadata,
  };

  if (opts.associatedEvent) content.event = opts.associatedEvent.encode();

  return JSON.stringify(content);
}
async function generateTags(mainSigner: NDKSigner, opts: ISaveOpts = {}) {
  const mainUser = await mainSigner.user();
  const tags = [
    ["p", mainUser.pubkey],
    ["client", "flockstr"],
  ];

  if (opts.associatedEvent) {
    const encodedEvent = opts.associatedEvent.encode();
    console.log("encodedEvent", encodedEvent);
    // TODO: This is trivially reversable; better to encrypt it or hash it with the pubkey
    const hashedEventReference = await getHashedKeyName(encodedEvent);
    console.log("hashedEventReference", hashedEventReference);
    tags.push(["e", hashedEventReference]);
  }

  if (opts.name) {
    const hashedName = await getHashedKeyName(opts.name);
    tags.push(["e", hashedName]);
  }

  return tags;
}

export async function saveEphemeralSigner(
  ndk: NDK,
  targetSigner: NDKPrivateKeySigner,
  opts: ISaveOpts = {},
) {
  // Determine current user signer
  const mainSigner = opts.mainSigner || ndk.signer;

  if (!mainSigner) throw new Error("No main signer provided");

  const mainUser = await mainSigner.user();

  // Create 2600 kind which saves encrypted JSON of the ephemeral signer's private key, the associated list, and other metadata
  const event = new NDKEvent(ndk, {
    kind: 2600,
    content: generateContent(targetSigner, opts),
    tags: await generateTags(mainSigner, opts),
  } as NostrEvent);
  event.pubkey = mainUser.pubkey;
  await event.encrypt(mainUser, mainSigner);
  await event.publish();

  // Update Ephemeral signers metadata
  console.log("Checking keyProfile", opts.keyProfile);
  const user = await targetSigner.user();
  if (opts.keyProfile) {
    const event = new NDKEvent(ndk, {
      kind: 0,
      content: JSON.stringify(opts.keyProfile),
      tags: [] as NDKTag[],
    } as NostrEvent);
    event.pubkey = user.pubkey;
    await event.sign(targetSigner);
    await event.publish();
  }
  return user;
}
