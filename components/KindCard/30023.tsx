"use client";
import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { type Event } from "nostr-tools";
import { removeDuplicates } from "@/lib/utils";

export default function Kind30023({ content, pubkey, tags }: Event) {
  const title = getTagValues("title", tags);
  const summary = getTagValues("summary", tags);
  const contentTags = removeDuplicates(getTagsValues("t", tags)).filter(
    Boolean,
  );

  return (
    <Container pubkey={pubkey} contentTags={contentTags}>
      <CardTitle className="mb-1.5 line-clamp-2 text-lg font-semibold leading-6">
        {title}
      </CardTitle>
      <CardDescription className="line-clamp-4 text-sm">
        {summary ?? content}
      </CardDescription>
    </Container>
  );
}
