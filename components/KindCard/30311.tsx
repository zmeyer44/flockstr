"use client";
import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { nip19 } from "nostr-tools";
import { toast } from "sonner";
import { copyText } from "@/lib/utils";
import { RenderText } from "../TextRendering";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import ReactPlayer from "react-player";

export default function Kind30311(props: Event) {
  const { pubkey, created_at: createdAt, tags } = props;
  const streamingUrl =
    getTagValues("streaming", tags) ?? getTagValues("recording", tags);
  const title = getTagValues("title", tags);
  const summary = getTagValues("summary", tags);
  const contentTags = getTagsValues("t", tags).filter(Boolean);
  const npub = nip19.npubEncode(pubkey);

  return (
    <Container
      pubkey={pubkey}
      createdAt={createdAt}
      contentTags={contentTags}
      actionOptions={[
        {
          label: "View profile",
          href: `/${npub}`,
          type: "link",
        },
        {
          label: "Copy raw data",
          type: "button",
          onClick: () => {
            void copyText(JSON.stringify(props));
            toast.success("Copied Text!");
          },
        },
      ]}
    >
      <ReactPlayer
        url={streamingUrl}
        playing={true}
        muted={false}
        controls={true}
      />
      <div className="border-t pt-4">
        {!!title && <CardTitle className="text-base">{title}</CardTitle>}
        {!!summary && <CardDescription>{summary}</CardDescription>}
      </div>
    </Container>
  );
}
