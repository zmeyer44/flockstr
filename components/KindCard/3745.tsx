"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { cn } from "@/lib/utils";
import { useNDK } from "@/app/_providers/ndk";
import { RiArrowRightLine, RiLockLine } from "react-icons/ri";
import { HiOutlineLockOpen } from "react-icons/hi";
import { decryptMessage } from "@/lib/nostr";
import { NDKUser } from "@nostr-dev-kit/ndk";
import { log } from "@/lib/utils";
import { EventSchema } from "@/types";
import KindCard from "@/components/KindCard";
import Spinner from "../spinner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { unlockEvent } from "@/lib/actions/create";
import { type KindCardProps } from "./";

export default function Kind3745(props: KindCardProps) {
  const { pubkey, content, id } = props;
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [decryptedEvent, setDecryptedEvent] = useState<Event>();
  const { ndk, signer } = useNDK();
  useEffect(() => {
    if (ndk && !fetchingEvent && !decryptedEvent) {
      void handleFetchEvent();
    }
  }, [ndk]);

  async function handleFetchEvent() {
    if (!ndk || !currentUser) return;
    log("func", `handleFetchEvent()`);
    setFetchingEvent(true);
    try {
      const directMessageEvent = await ndk.fetchEvent({
        kinds: [4],
        ["#e"]: [id],
        ["#p"]: [currentUser.pubkey],
      });
      if (directMessageEvent) {
        log("info", "direct msg decryption");
        if (!signer) return;
        await directMessageEvent.decrypt(
          new NDKUser({ hexpubkey: directMessageEvent.pubkey }),
          signer,
        );
        const passphrase_ = directMessageEvent.content;
        if (!passphrase_) {
          setError("Unable to parse event");
          return;
        }
        setPassphrase(passphrase_);
        const decrypedData = await decryptMessage(content, passphrase_);
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
      console.log("ERROR", err);
    } finally {
      setFetchingEvent(false);
    }
  }

  async function handleUnlockEvent() {
    await unlockEvent(ndk!, props, passphrase);
    window.location.reload();
  }

  if (decryptedEvent) {
    return (
      <div className="group relative">
        <KindCard {...decryptedEvent} locked={true} />
        {currentUser?.pubkey === decryptedEvent.pubkey && (
          <div
            className={cn(
              "absolute bottom-[5px] right-[5px] opacity-20 transition-opacity group-hover:opacity-50",
              "hover:!opacity-100",
            )}
          >
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Button
                    onClick={handleUnlockEvent}
                    size={"icon"}
                    className=""
                  >
                    <HiOutlineLockOpen className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end">
                  <p>Unlock Content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    );
  }
  return (
    <Container event={props}>
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
