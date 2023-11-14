import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { RenderText } from "../TextRendering";
import { getTagsValues } from "@/lib/nostr/utils";
import LinkCard from "@/components/LinkCard";
import { copyText } from "@/lib/utils";
import { nip19 } from "nostr-tools";
import { toast } from "sonner";
import { type KindCardProps } from "./";

export default function Kind1(props: KindCardProps) {
  const { content, pubkey, tags, created_at: createdAt } = props;
  const r = getTagsValues("r", tags).filter(Boolean);
  const npub = nip19.npubEncode(pubkey);

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
      <CardDescription className="text-sm font-normal text-secondary-foreground">
        <RenderText text={content} />
      </CardDescription>
      {!!r.length && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {r.map((url, idx) => (
            <LinkCard key={idx} url={url} className="max-w-[250px]" />
          ))}
        </div>
      )}
    </Container>
  );
}
