import { nip19 } from "nostr-tools";
import { btcToSats } from "../utils";
export const NOSTR_BECH32_REGEXP =
  /^(npub|nprofile|note|nevent|naddr|nrelay)1[023456789acdefghjklmnpqrstuvwxyz]+/;

export function nip19ToTag(nip19Id: string): string[] | undefined {
  const decoded = nip19.decode(nip19Id);

  let tag: string[];
  switch (decoded.type) {
    case "npub":
    case "note":
      return ["p", decoded.data];
    case "nprofile":
      tag = ["e", decoded.data.pubkey];
      if (decoded.data.relays && decoded.data.relays.length > 0)
        tag.push(decoded.data.relays[0] as string);
      return tag;
    case "nevent":
      tag = ["e", decoded.data.id];
      if (decoded.data.relays && decoded.data.relays.length > 0)
        tag.push(decoded.data.relays[0] as string);
      return tag;
    case "naddr":
      tag = [
        "a",
        `${decoded.data.kind}:${decoded.data.pubkey}:${decoded.data.identifier}`,
      ];
      if (decoded.data.relays && decoded.data.relays.length > 0) {
        tag.push(decoded.data.relays[0] as string);
      }
      return tag;
  }
}

export function aTagToNip19(aTag: string[]): string {
  if (aTag[0] !== "a") throw new Error("Not an a tag");
  const tagIdSplit = aTag[1]!.split(":");

  return nip19.naddrEncode({
    kind: parseInt(tagIdSplit[0] as string),
    pubkey: tagIdSplit[1] as string,
    identifier: tagIdSplit[2] as string,
  });
}
export const getTagValues = (name: string, tags: string[][]) => {
  const [itemTag] = tags.filter((tag: string[]) => tag[0] === name);
  const [, item] = itemTag || [, undefined];
  return item;
};
export const getTagAllValues = (name: string, tags: string[][]) => {
  const [itemTag] = tags.filter((tag: string[]) => tag[0] === name);
  const itemValues = itemTag || [, undefined];
  return itemValues.map((i, idx) => (idx ? i : undefined)).filter(Boolean);
};
export const getTagsValues = (name: string, tags: string[][]) => {
  const itemTags = tags.filter((tag: string[]) => tag[0] === name);
  return itemTags.map(([key, val]) => val) ?? [];
};
export const getTagsAllValues = (name: string, tags: string[][]) => {
  const itemTags = tags.filter((tag: string[]) => tag[0] === name);
  return itemTags.map(([key, ...vals]) => vals) ?? [];
};

export const getPrice = (tags: string[][]) => {
  const price = tags.find(([i]) => i === "price");
  if (!price) return;
  const [_, amount, currency = "BTC", frequency] = price as [
    string,
    string,
    string | undefined,
    string | undefined,
  ];

  return {
    amount,
    currency,
    frequency,
    asSats:
      currency?.toLowerCase() === "btc"
        ? btcToSats(parseFloat(amount))
        : parseInt(amount),
  };
};
