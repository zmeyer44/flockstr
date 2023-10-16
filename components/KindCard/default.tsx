import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { nip19 } from "nostr-tools";
import { toast } from "sonner";
import { copyText } from "@/lib/utils";

export default function KindDefault(props: Event) {
  const { pubkey, created_at: createdAt } = props;
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
      <CardTitle className="mb-1.5 line-clamp-2 text-lg font-semibold">
        The start of the Nostr revolution
      </CardTitle>
      <CardDescription className="line-clamp-4 text-sm">
        This is the summary of this artilce. Let's hope that it is a good
        article and that it will end up being worth reading. I don't want to
        waste my time on some random other stuff.
      </CardDescription>
    </Container>
  );
}
