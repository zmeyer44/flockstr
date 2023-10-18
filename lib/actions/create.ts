import { nip19 } from "nostr-tools";
import NDK, {
  NDKEvent,
  type NDKPrivateKeySigner,
  type NDKTag,
  type NDKList,
  type NostrEvent,
  NDKUser,
} from "@nostr-dev-kit/ndk";
import { generateRandomString, encryptMessage, randomId } from "@/lib/nostr";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { getTagsValues } from "@/lib/nostr/utils";

export async function createEvent(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
) {
  try {
    const pubkey = await window.nostr?.getPublicKey();
    if (!pubkey || !window.nostr) {
      throw new Error("No public key provided!");
    }
    const eventToPublish = new NDKEvent(ndk, {
      ...event,
      pubkey,
      created_at: unixTimeNowInSeconds(),
    } as NostrEvent);
    console.log("eventToPublish ", eventToPublish);

    const signed = await eventToPublish.sign();
    console.log("signed", signed);
    await eventToPublish.publish();
    return eventToPublish;
  } catch (err) {
    console.log(err);
    alert("An error has occured");
    return false;
  }
}
export async function createEventHandler(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  isPrivate?: boolean,
  list?: NDKList,
  delegateSigner?: NDKPrivateKeySigner,
) {
  const pubkey = await window.nostr?.getPublicKey();
  if (!pubkey || !window.nostr) {
    throw new Error("No public key provided!");
  }
  const eventToPublish = new NDKEvent(ndk, {
    ...event,
    tags: [...event.tags, ["client", "flockstr"]],
    pubkey,
    created_at: unixTimeNowInSeconds(),
  } as NostrEvent);

  await eventToPublish.sign();

  let publishedEvent: NDKEvent | null = null;
  // Check if is private event
  if (isPrivate) {
    const rawEventString = JSON.stringify(eventToPublish.rawEvent());
    const passphrase = generateRandomString();
    const encryptedRawEventString = await encryptMessage(
      rawEventString,
      passphrase,
    );
    const signer = delegateSigner ?? ndk.signer!;
    const user = await signer.user();

    const newEvent = new NDKEvent(ndk, {
      content: encryptedRawEventString,
      kind: 3745,
      tags: [
        ["kind", event.kind.toString()],
        ["client", "flockstr"],
      ],
      pubkey: user.pubkey,
    } as NostrEvent);
    await newEvent.sign(signer);
    await newEvent.publish();

    if (list) {
      // Send DMs to subscribers
      const subscribers = getTagsValues("p", list.tags);
      for (const subscriber of subscribers) {
        const messageEvent = new NDKEvent(ndk, {
          content: passphrase,
          kind: 4,
          tags: [
            ["p", subscriber],
            ["e", newEvent.id],
            ["client", "flockstr"],
          ],
          pubkey: user.pubkey,
        } as NostrEvent);
        await messageEvent.encrypt(
          new NDKUser({ hexpubkey: subscriber }),
          signer,
        );
        await messageEvent.sign(signer);
        await messageEvent.publish();
      }
    }
    publishedEvent = newEvent;
  } else {
    await eventToPublish.publish();
    publishedEvent = eventToPublish;
  }
  if (list) {
    const tag = publishedEvent.tagReference();
    if (!tag) return;
    // Add event to list
    await list.addItem(tag, undefined, false);
    await list.sign();
    await list.publish();
  }
  return true;
}

export async function createReaction(
  ndk: NDK,
  content: "+" | "-",
  event: {
    id: string;
    pubkey: string;
  },
) {
  return createEvent(ndk, {
    content,
    kind: 7,
    tags: [
      ["e", event.id],
      ["p", event.pubkey],
    ],
  });
}
export async function createList(
  ndk: NDK,
  title: string,
  description?: string,
) {
  return createEvent(ndk, {
    content: "",
    kind: 30001,
    tags: [
      ["name", title],
      ["description", description ?? ""],
      ["d", randomId()],
    ],
  });
}
export async function deleteEvent(
  ndk: NDK,
  events: [["e", string] | ["a", `${number}:${string}:${string}`]],
  reason?: string,
) {
  return createEvent(ndk, {
    kind: 5,
    content: reason ?? "",
    tags: events,
  });
}

async function generateEvent(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  delegateSigner?: NDKPrivateKeySigner,
): Promise<NDKTag | undefined> {
  let _value = event.content.trim();

  // if this a relay URL, nrelay-encode it
  if (_value.startsWith("wss://")) {
    _value = nip19.nrelayEncode(_value);
  }

  try {
    const decode = nip19.decode(_value);

    switch (decode.type) {
      case "naddr":
      case "note":
      case "nevent":
        // We were able to decode something that looks like an event
        // fetch it
        const _event = await ndk.fetchEvent(_value);
        if (_event) {
          // we were able to fetch it, let's return it
          return _event.tagReference();
        } else {
          // TODO: Generate a NDKTag based on the values
          return undefined;
        }
      case "nrelay":
        return ["r", decode.data as string];
      case "npub":
        return ["p", decode.data as string];
      case "nprofile":
        const d = ["p", decode.data.pubkey];
        if (decode.data.relays && decode.data.relays[0])
          d.push(decode.data.relays[0]);
        return d;
    }
  } catch (e) {
    console.log("at catch", e);
    const signer = delegateSigner ?? ndk.signer!;
    console.log("Signer", signer);
    const user = await signer.user();
    console.log("User", user);
    const newEvent = new NDKEvent(ndk, {
      content: _value || "",
      kind: 1,
      tags: [...event.tags, ["client", "flockstr"]],
      pubkey: user.pubkey,
    } as NostrEvent);
    console.log("Event to create", newEvent);

    await newEvent.sign(signer);

    await newEvent.publish();

    return newEvent.tagReference();
  }
}
export async function createEventOnList(
  ndk: NDK,
  event: {
    content: string;
    kind: number;
    tags: string[][];
  },
  list: NDKList,
  delegateSigner?: NDKPrivateKeySigner,
) {
  const tag = await generateEvent(ndk, event, delegateSigner);

  if (!tag) return;
  await list.addItem(tag, undefined, false);
  await list.sign();
  await list.publish();
  return true;
}

export async function updateList(
  ndk: NDK,
  list: NostrEvent,
  newTags: [string, string][],
) {
  let tags = list.tags;
  for (const [key, value] of newTags) {
    const index = tags.findIndex(([tK]) => tK === key);
    if (index !== -1) {
      // Replace old
      tags[index] = [key, value];
    } else {
      tags.push([key, value]);
    }
  }
  console.log("updating list", tags);
  return createEvent(ndk, {
    ...list,
    kind: list.kind as number,
    tags: tags.filter(([_, value]) => value !== undefined),
  });
}
