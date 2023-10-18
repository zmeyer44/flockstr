"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { cn } from "@/lib/utils";
import { useNDK } from "@/app/_providers/ndk";
import { RiArrowRightLine, RiLockLine } from "react-icons/ri";
import { decryptMessage } from "@/lib/nostr";
import { NDKUser } from "@nostr-dev-kit/ndk";

import { EventSchema } from "@/types";
import KindCard from "@/components/KindCard";
import Spinner from "../spinner";

export default function Kind3745(props: Event) {
  const { pubkey, content, id } = props;
  const [error, setError] = useState("");
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [decryptedEvent, setDecryptedEvent] = useState<Event>();
  const { ndk } = useNDK();
  useEffect(() => {
    if (ndk && !fetchingEvent && !decryptedEvent) {
      void handleFetchEvent();
    }
  }, [ndk]);

  async function handleFetchEvent() {
    setFetchingEvent(true);
    try {
      const directMessageEvent = await ndk!.fetchEvent({
        kinds: [4],
        authors: [pubkey],
        ["#e"]: [id],
      });
      if (directMessageEvent) {
        console.log("Found DM", directMessageEvent);
        await directMessageEvent.decrypt(
          new NDKUser({ hexpubkey: pubkey }),
          ndk!.signer,
        );
        console.log("Decryped DM", directMessageEvent);
        const passphrase = directMessageEvent.content;
        if (!passphrase) {
          setError("Unable to parse event");
          return;
        }
        const decrypedData = await decryptMessage(content, passphrase);
        console.log("Decrypted", decrypedData);
        const hiddenEvent = EventSchema.safeParse(
          JSON.parse(decrypedData ?? ""),
        );
        if (hiddenEvent.success) {
          setDecryptedEvent(hiddenEvent.data);
        } else {
          setError("Unable to parse event");
        }
      }
    } catch (err) {
      setError("Unable to parse event");
    } finally {
      setFetchingEvent(false);
    }
  }
  if (decryptedEvent) {
    return <KindCard {...decryptedEvent} />;
  }
  return (
    <Container pubkey={pubkey}>
      <div className="relative ">
        <div className=" blur">
          <CardTitle className="mb-1.5 line-clamp-2 text-lg font-semibold">
            The start of the Nostr revolution
          </CardTitle>
          <CardDescription className="line-clamp-4 text-sm">
            Here is some secret text. If you are reading this, that means you've
            tried some sneaky css tricks to reveal what was hidden 🫣.
            Unfourtunatly, CSS won't be able to help you here. In fact, I can't
            even reveal this if I wanted to. Only the correct private key can
            reveal it.
          </CardDescription>
        </div>
        <div className="center absolute inset-0">
          {fetchingEvent ? (
            <div className="center">
              <Spinner />
            </div>
          ) : (
            <Link href={`/`} className="group flex rounded-md shadow-sm">
              <div
                className={cn(
                  "flex w-14 flex-shrink-0 items-center justify-center rounded-l-md bg-primary text-sm font-medium text-background",
                )}
              >
                <RiLockLine className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border border-b border-r border-t bg-background">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <a className="font-medium text-foreground group-hover:text-primary">
                    Content locked
                  </a>
                  <p className="text-gray-500">Subscribe to reveal</p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground group-hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <RiArrowRightLine className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}
