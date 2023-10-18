import { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { updateList } from "@/lib/actions/create";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modal/provider";
import { toast } from "sonner";
import { useNDK } from "@/app/_providers/ndk";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";

const ShortTextNoteSchema = z.object({
  content: z.string(),
  image: z.string().optional(),
  list: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

type ShortTextNoteType = z.infer<typeof ShortTextNoteSchema>;

export default function ShortTextNoteModal() {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { ndk } = useNDK();
  //   const { events } = useEvents({
  //     filter: {
  //       kinds: [listEvent.kind as number],
  //       authors: [listEvent.pubkey],
  //       since: unixTimeNowInSeconds() - 10,
  //       limit: 1,
  //     },
  //     enabled: sent,
  //   });
  //   useEffect(() => {
  //     if (events.length) {
  //       console.log("Done!");
  //       setIsLoading(false);
  //       toast.success("List Updated!");
  //       modal?.hide();
  //     }
  //   }, [events]);

  async function handleSubmit(listData: ShortTextNoteType) {
    setIsLoading(true);
    const newTags = Object.entries(listData);
    setSent(true);
    // const result = await updateList(ndk!, listEvent, newTags);
  }

  return (
    <FormModal
      title="Short Text Note"
      fields={[
        {
          label: "Content",
          type: "text-area",
          slug: "content",
        },
        {
          label: "Add to list",
          type: "select-search",
          placeholder: "Search your lists",
          slug: "list",
          options: [
            {
              label: "Spicy Takes 🌶️",
              value: "325grg ",
            },
            {
              label: "Public reading list",
              value: "grherh ",
            },
            {
              label: "Radnosm other",
              value: "grhfaggferh ",
            },
          ],
        },
        {
          label: "Private",
          type: "toggle",
          slug: "isPrivate",
        },
      ]}
      formSchema={ShortTextNoteSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Publish",
      }}
    />
  );
}
