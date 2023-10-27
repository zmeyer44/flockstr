"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { formatDate, fromUnix } from "@/lib/utils/dates";
import Actions from "./Actions";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagAllValues, getTagValues } from "@/lib/nostr/utils";
import useProfile from "@/lib/hooks/useProfile";
import { nip19 } from "nostr-tools";
import { getNameToShow, getTwoLetters } from "@/lib/utils";
type ArticleProps = {
  event: NDKEvent;
};

export default function ArticlePage({ event }: ArticleProps) {
  const Viewer = useMemo(
    () => dynamic(() => import("@/components/LongForm"), { ssr: false }),
    [],
  );
  console.log(event);
  const router = useRouter();
  const markdown = event.content;
  const pubkey = event.pubkey;
  const createdAt = getTagValues("published_at", event.tags)
    ? parseInt(getTagValues("published_at", event.tags) as string)
    : event.created_at;
  const { profile } = useProfile(pubkey);
  const npub = nip19.npubEncode(pubkey);
  const title = getTagValues("title", event.tags);
  const summary = getTagValues("summary", event.tags);
  const tags = getTagAllValues("t", event.tags);
  const image = getTagValues("image", event.tags);

  return (
    <div className="relative @container">
      <div className="sticky inset-x-0 top-0 z-10 flex items-center justify-between border-b bg-background pb-4 pt-4">
        <div className="center gap-x-3">
          <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
            <AvatarImage src={profile?.image} alt="user" />
            <AvatarFallback className="text-xs">
              {getTwoLetters({ profile, npub })}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs uppercase text-muted-foreground">
            {getNameToShow({ profile, npub })}
          </span>
        </div>
        <Button
          onClick={() => {
            if (sessionStorage.getItem("RichHistory")) {
              void router.back();
            } else {
              void router.push("/app");
            }
          }}
          size="icon"
          variant={"outline"}
          className=""
        >
          <RiCloseFill className="h-5 w-5" />
        </Button>
      </div>
      <div className="h-[20px] w-full"></div>
      <div className="vmax-h-[calc(100vh_-_100px)] overflow-y-auto">
        <article className="prose prose-zinc relative mx-auto max-w-3xl pt-7 dark:prose-invert">
          <div className="">
            <div className="flex items-center justify-between gap-1 lg:mb-2">
              {tags.map((t) => (
                <Button variant={"link"} className="px-0">
                  {t}
                </Button>
              ))}

              <div className="center text-xs text-muted-foreground/50">
                {!!createdAt && (
                  <span className="mr-2.5">
                    {formatDate(fromUnix(createdAt), "MMMM Do, YYYY")}
                  </span>
                )}
                <span className="h-3 w-[1px] rounded-full bg-muted-foreground/50"></span>
              </div>
            </div>
            <h1 className="">{title}</h1>
            <div className="mb-5 flex items-center justify-end">
              <Actions />
            </div>
            <div className="rounded-r-lg border-l-[4px] border-primary bg-muted p-4">
              <p className="m-0">{summary} </p>
            </div>
            {image && (
              <div className="max-h-[400px] w-full">
                <Image
                  src={image}
                  alt="article banner image"
                  height="288"
                  width="288"
                  unoptimized
                  className="mb-0 mt-5 max-h-[400px] w-full rounded-lg object-cover sm:mt-8"
                />
              </div>
            )}
          </div>
          <Viewer content={markdown} />
        </article>
      </div>
    </div>
  );
}
