"use client";
import { useEffect } from "react";
import Editor_ from "@/containers/Article/Editor";
import Editor from "@/components/LongForm/Editor";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { nip19 } from "nostr-tools";
import Spinner from "@/components/spinner";
import useEvents from "@/lib/hooks/useEvents";

export default function EditorPage({
  params: { key },
}: {
  params: {
    key: string;
  };
}) {
  return (
    <div className="">
      {/* <Editor /> */}
      <Editor_ />
    </div>
  );
}
