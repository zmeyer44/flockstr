// import "websocket-polyfill";
import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { getTagValues } from "./utils";
import { sha256 as SHA256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import crypto from "crypto";

export enum Kind {
  Metadata = 0,
  Text = 1,
  RecommendRelay = 2,
  Contacts = 3,
  EncryptedDirectMessage = 4,
  EventDeletion = 5,
  Reaction = 7,
  ChannelCreation = 40,
  ChannelMetadata = 41,
  ChannelMessage = 42,
  ChannelHideMessage = 43,
  ChannelMuteUser = 44,
  ProfileList = 30000,
  GenericList = 30001,
}

export type Event = {
  id?: string;
  sig?: string;
  kind: Kind;
  tags: string[][];
  pubkey: string;
  content: string;
  created_at: number;
};

export function getHashedKeyName(name: string) {
  let eventHash = SHA256(name);
  const version = bytesToHex(eventHash);
  const alt = sha256(name).toString(Hex);
  console.log("VERSION", version, "vs", alt);
  console.log("EQUAL?", version === alt);
  return version;
}

export namespace NostrService {
  export function createEvent(
    kind: number,
    publicKey: string,
    content: string,
    tags: string[][],
  ) {
    const event: Event = {
      kind: kind,
      pubkey: publicKey,
      created_at: Math.floor(Date.now() / 1000),
      content: content,
      tags: tags,
    };
    event.id = getEventHash(event);

    return event;
  }

  function serializeEvent(evt: Event) {
    return JSON.stringify([
      0,
      evt.pubkey,
      evt.created_at,
      evt.kind,
      evt.tags,
      evt.content,
    ]);
  }

  function getEventHash(event: Event): string {
    return sha256(serializeEvent(event)).toString(Hex);
  }

  export async function signEvent(event: Event) {
    try {
      return await window.nostr?.signEvent(event);
    } catch (err: any) {
      console.error("signing event failed");
    }
    return event;
  }

  export function filterBlogEvents(eventArray: Event[]) {
    const filteredEvents = eventArray.filter((e1: Event, index: number) => {
      if (e1.content === "") {
        return false;
      }
      const title = getTagValues("title", e1.tags);
      if (!title || title === "") {
        return false;
      }
      // return eventArray.findIndex((e2: Event) => e2.id === e1.id) === index;
      return true;
    });
    return filteredEvents;
  }
}

export function encryptMessage(message: string, password: string) {
  try {
    const buffer = create32ByteBuffer(password);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", buffer, iv);

    const encrypted = Buffer.concat([
      cipher.update(message, "utf-8"),
      cipher.final(),
    ]);

    return encrypted.toString("base64") + "?iv=" + iv.toString("base64");
  } catch (e) {
    console.error(e);
  }
}
// Function to decrypt a hashed message using a passphrase
export function decryptMessage(encryptedMessage: string, password: string) {
  console.log("Attemping decrypto", encryptedMessage, "with", password);
  try {
    const buffer = create32ByteBuffer(password);
    // Extract IV from the received message
    const ivBase64 = encryptedMessage.split("?iv=")[1];
    if (!ivBase64) {
      return;
    }

    const iv = Buffer.from(ivBase64, "base64");

    const encryptedText = Buffer.from(encryptedMessage, "base64");
    console.log("at bugger");
    const decipher = crypto.createDecipheriv("aes-256-cbc", buffer, iv);
    console.log("at decipher");

    const decrypted = decipher.update(encryptedText);

    const toReturn = Buffer.concat([decrypted, decipher.final()]).toString();
    console.log("toReturn", toReturn);
    return toReturn;
  } catch (e) {
    console.error(e);
  }
}
function create32ByteBuffer(inputString: string) {
  const hash = crypto.createHash("sha256").update(inputString).digest("hex");
  const buffer = Buffer.from(hash, "hex");
  return buffer;
}

export function generateRandomString() {
  return crypto.randomBytes(32).toString("hex");
}
