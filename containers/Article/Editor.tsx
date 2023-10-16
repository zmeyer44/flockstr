"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/dates";
import Actions from "./Actions";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagAllValues, getTagValues } from "@/lib/nostr/utils";
import Editor from "@/components/LongForm/Editor";
import { Toolbar } from "@/components/LongForm/ToolBar";
type ArticleProps = {
  event?: NDKEvent;
};

export default function EditorPage({ event }: ArticleProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  async function handleSubmit({
    title,
    summary,
    image,
  }: {
    title: string;
    summary: string;
    image?: string;
  }) {
    console.log("Writing", title, summary, image, content);
  }

  return (
    <div className="relative @container">
      <div className="sticky inset-x-0 top-0 z-10 flex items-center justify-between border-b bg-background pb-4 pt-4">
        <div className="center gap-x-3">
          <span className="text-xs uppercase text-muted-foreground">
            New Long Form
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
      <article className="relative mx-auto -mt-5 max-w-3xl">
        <div className="pb-4 pl-[54px]">
          <Toolbar onSubmit={handleSubmit} />
        </div>
        <Editor
          editable={true}
          onContentChange={(content) => setContent(content)}
        />
      </article>
    </div>
  );
}
