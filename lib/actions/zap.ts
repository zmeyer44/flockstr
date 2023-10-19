import NDK, {
  NDKEvent,
  NDKUser,
  NDKSigner,
  zapInvoiceFromEvent,
  type NostrEvent,
} from "@nostr-dev-kit/ndk";
import { requestProvider } from "webln";
import { bech32 } from "@scure/base";
import { z } from "zod";
import { createZodFetcher } from "zod-fetch";
import { getTagValues, getTagsAllValues } from "../nostr/utils";
import { unixTimeNowInSeconds } from "../nostr/dates";
import { createEvent } from "./create";
import { findEphemeralSigner } from "@/lib/actions/ephemeral";
import { log } from "@/lib/utils";

const fetchWithZod = createZodFetcher();
const ZapEndpointResponseSchema = z.object({
  nostrPubkey: z.string(),
});

export async function sendZap(
  ndk: NDK,
  amount: number,
  _event: NostrEvent,
  comment?: string,
) {
  log("func", "sendZap");
  const event = await new NDKEvent(ndk, _event);
  log("info", event.toString());
  const pr = await event.zap(amount * 1000, comment);
  if (!pr) {
    log("info", "No PR");
    return;
  }
  const webln = await requestProvider();
  return await webln.sendPayment(pr);
}
export async function checkPayment(
  ndk: NDK,
  tagId: string,
  pubkey: string,
  event: NostrEvent,
) {
  const paymentEvents = await ndk.fetchEvents({
    kinds: [9735],
    ["#a"]: [tagId],
  });
  if (!paymentEvents) return;
  const paymentEvent = Array.from(paymentEvents).find(
    (e) => zapInvoiceFromEvent(e)?.zappee === pubkey,
  );
  if (!paymentEvent) return;
  const invoice = zapInvoiceFromEvent(paymentEvent);
  if (!invoice) {
    console.log("No invoice");
    return;
  }

  const zappedUser = ndk.getUser({
    hexpubkey: invoice.zapped,
  });
  await zappedUser.fetchProfile();
  if (!zappedUser.profile) {
    console.log("No zappedUser profile");
    return;
  }
  const { lud16, lud06 } = zappedUser.profile;
  let zapEndpoint: null | string = null;

  if (lud16 && !lud16.startsWith("LNURL")) {
    const [name, domain] = lud16.split("@");
    zapEndpoint = `https://${domain}/.well-known/lnurlp/${name}`;
  } else if (lud06) {
    const { words } = bech32.decode(lud06, 1e3);
    const data = bech32.fromWords(words);
    const utf8Decoder = new TextDecoder("utf-8");
    zapEndpoint = utf8Decoder.decode(data);
  }
  if (!zapEndpoint) {
    console.log("No zapEndpoint");
    return;
  }

  const { nostrPubkey } = await fetchWithZod(
    // The schema you want to validate with
    ZapEndpointResponseSchema,
    // Any parameters you would usually pass to fetch
    zapEndpoint,
    {
      method: "GET",
    },
  );
  if (!nostrPubkey) return;
  console.log("nostrPubkey", nostrPubkey);
  console.log("Invoice amount", invoice.amount);
  console.log("Price", parseInt(getTagValues("price", event.tags) ?? "0"));
  return (
    nostrPubkey === paymentEvent.pubkey &&
    invoice.amount >= parseInt(getTagValues("price", event.tags) ?? "0")
  );
}
export async function updateListUsersFromZaps(
  ndk: NDK,
  tagId: string,
  event: NostrEvent,
) {
  log("func", "updateListUsersFromZaps");
  const SECONDS_IN_MONTH = 2_628_000;
  const SECONDS_IN_YEAR = SECONDS_IN_MONTH * 365;
  const paymentEvents = await ndk.fetchEvents({
    kinds: [9735],
    ["#a"]: [tagId],
    since: unixTimeNowInSeconds() - SECONDS_IN_YEAR,
  });
  const paymentInvoices = Array.from(paymentEvents).map((paymentEvent) =>
    zapInvoiceFromEvent(paymentEvent),
  );

  const currentUsers = getTagsAllValues("p", event.tags);
  let validUsers: string[][] = currentUsers.filter(
    ([pubkey, relay, petname, expiryUnix]) =>
      parseInt(expiryUnix ?? "0") > unixTimeNowInSeconds(),
  );
  const newUsers: string[] = currentUsers.map(([pub]) => pub as string);

  for (const paymentInvoice of paymentInvoices) {
    if (
      !paymentInvoice ||
      validUsers.find(([pubkey]) => pubkey === paymentInvoice.zappee)
    ) {
      continue;
    }
    const isValid = await checkPayment(
      ndk,
      tagId,
      paymentInvoice.zappee,
      event,
    );
    if (isValid) {
      validUsers.push([
        paymentInvoice.zappee,
        "",
        "",
        (unixTimeNowInSeconds() + SECONDS_IN_YEAR).toString(),
      ]);
      newUsers.push(paymentInvoice.zappee);
      // Send old codes to user
    }
  }
  log("info", "New users", newUsers.toString());

  await sendCodesToNewUsers(ndk, newUsers, tagId, event);

  // Add self;
  const selfIndex = validUsers.findIndex(([vu]) => vu === event.pubkey);
  if (selfIndex === -1) {
    validUsers.push([event.pubkey, "", "self", "4000000000"]);
  }
  return createEvent(ndk, {
    ...event,
    kind: event.kind as number,
    tags: [
      ...event.tags.filter(([key]) => key !== "p"),
      ...validUsers.map((user) => ["p", ...user]),
    ],
  });
}

async function sendCodesToNewUsers(
  ndk: NDK,
  users: string[],
  tagId: string,
  event: NostrEvent,
) {
  const signer = await findEphemeralSigner(ndk, ndk.signer!, {
    associatedEventNip19: new NDKEvent(ndk, event).encode(),
  });
  log("func", "sendCodesToNewUsers");
  log("info", "Signer", signer?.toString());

  if (!signer) return;
  const delegate = await signer.user();
  const messages = await ndk.fetchEvents({
    authors: [delegate.pubkey],
    kinds: [4],
    ["#p"]: [tagId.split(":")?.[1] ?? ""],
  });
  const codes: [string, string][] = [];
  for (const message of Array.from(messages)) {
    await message.decrypt();
    codes.push([getTagValues("e", message.tags) ?? "", message.content]);
  }
  log("info", "codes", codes.toString());

  for (const user of users) {
    for (const [event, code] of codes) {
      const messageEvent = new NDKEvent(ndk, {
        content: code,
        kind: 4,
        tags: [
          ["p", user],
          ["e", event],
          ["client", "flockstr"],
        ],
        pubkey: delegate.pubkey,
      } as NostrEvent);
      log("info", "sending message");
      await messageEvent.encrypt(new NDKUser({ hexpubkey: user }), signer);
      await messageEvent.sign(signer);
      await messageEvent.publish();
    }
  }
}
