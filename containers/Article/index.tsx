"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/dates";
import Actions from "./Actions";
import Logo from "@/assets/Logo";

export default function ArticlePage() {
  const Viewer = useMemo(
    () => dynamic(() => import("@/components/LongForm"), { ssr: false }),
    [],
  );
  const router = useRouter();
  const markdown = `Do you have any thoughts of YakiHonne? Share it and earn SATs!

  Comment2Earn | Earn SATs by sharing your comments on YakiHonne
  
  Earn SATs by sharing your comments on YakiHonne.
  
  ⏰2nd - 15th Oct
  
  ### Follow Us
  
  - Nostr: npub1yzvxlwp7wawed5vgefwfmugvumtp8c8t0etk3g8sky4n0ndvyxesnxrf8q
  - Twitter: https://twitter.com/YakiHonne
  - Facebook Profile: https://www.facebook.com/profi…1715056704
  - Facebook Page: https://www.facebook.com/profi…2076811240
  - Facebook Group: https://www.facebook.com/group…4539860115
  - Youtube: https://www.youtube.com/channe…f4EyFJ7BlA
  
  ### How to Get SATs:
  1. Post your thoughts about YakiHonne on at least one of the above social media, and be sure to @ YakiHonne.
  2. Follow YakiHonne on at least one of the social media above.
  3. Back to this article, leave your social account which followed YakiHonne in the Comments.
  4. Be zapped with SATs.
  
  ### What You Will Get:
  1. 500 SATs, if you finished all steps.
  2. 1000 SATs, if you finished all steps and`;

  return (
    <div className="relative @container">
      <div className="sticky inset-x-0 top-0 z-10 flex items-center justify-between border-b bg-background pb-4 pt-4">
        <div className="center gap-x-3">
          <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
            <AvatarImage
              src={
                "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
              }
              alt="user"
            />
            <AvatarFallback className="text-xs">SC</AvatarFallback>
          </Avatar>
          <span className="text-xs uppercase text-muted-foreground">
            Derek Seivers
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
        <article className="prose dark:prose-invert prose-zinc relative mx-auto max-w-3xl pt-7">
          <div className="">
            <div className="flex items-center justify-between gap-1 lg:mb-2">
              <Button variant={"link"} className="px-0">
                Balaji's News Letter
              </Button>
              <div className="center text-xs text-muted-foreground/50">
                <span className="mr-2.5">
                  {formatDate(new Date("10-2-22"), "MMMM Do, YYYY")}
                </span>
                <span className="h-3 w-[1px] rounded-full bg-muted-foreground/50"></span>
              </div>
            </div>
            <h1 className="">
              This is the large title for the article. It's time to take over.
            </h1>
            <div className="mb-3 flex items-center justify-end">
              <Actions />
            </div>
            <div className="rounded-r-lg border-l-[4px] border-primary bg-muted p-4">
              <p className="m-0">
                Here is a short summary for the article that you are about to
                start reading. Get ready to really enojy your self.
              </p>
            </div>
          </div>
          <Viewer content={markdown} />
        </article>
      </div>
      <div className="center fixed inset-0 bg-red-400">
        <Logo className="fill-gradie h-[200px] w-[200px] bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent" />
      </div>
    </div>
  );
}
