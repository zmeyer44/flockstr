import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { nip19 } from "nostr-tools";
import { toast } from "sonner";
import { copyText } from "@/lib/utils";
import { RenderText } from "../TextRendering";
import { getTagsValues } from "@/lib/nostr/utils";
import LinkCard from "@/components/LinkCard";

export default function KindDefault(props: Event) {
  const { pubkey, created_at: createdAt, tags } = props;
  const r = getTagsValues("r", tags).filter(Boolean);

  const npub = nip19.npubEncode(pubkey);

  return (
    <Container
      pubkey={pubkey}
      createdAt={createdAt}
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
        <RenderText text={props.content} />
      </CardDescription>
      {!!r.length && (
        <div className="mt-1.5 flex flex-wrap">
          {r.map((url, idx) => (
            <LinkCard key={idx} url={url} className="max-w-[250px]" />
          ))}
        </div>
      )}
    </Container>
  );
}
