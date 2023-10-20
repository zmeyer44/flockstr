"use client";
import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { getTagValues, getTagsValues } from "@/lib/nostr/utils";
import { nip19 } from "nostr-tools";
import { removeDuplicates } from "@/lib/utils";
import { toast } from "sonner";
import { copyText } from "@/lib/utils";
import { type KindCardProps } from "./";

export default function Kind30023(props: KindCardProps) {
  const { content, pubkey, tags, created_at: createdAt } = props;
  const npub = nip19.npubEncode(pubkey);
  const title = getTagValues("title", tags);
  const summary = getTagValues("summary", tags);
  const contentTags = removeDuplicates(getTagsValues("t", tags)).filter(
    Boolean,
  );

  return (
    <Container
      event={props}
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
      <CardTitle className="mb-1.5 line-clamp-2 text-lg font-semibold leading-6">
        {title}
      </CardTitle>
      <CardDescription className="line-clamp-4 text-sm">
        {summary ?? content}
      </CardDescription>
    </Container>
  );
}
