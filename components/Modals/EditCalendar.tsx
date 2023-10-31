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

const EditCalendarSchema = z.object({
  name: z.string(),
  about: z.string().optional(),
  image: z.string().optional(),
  banner: z.string().optional(),
});

type EditListType = z.infer<typeof EditCalendarSchema>;

type EditListModalProps = {
  listEvent: NostrEvent;
};

export default function EditListModal({ listEvent }: EditListModalProps) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { ndk } = useNDK();
  const { events } = useEvents({
    filter: {
      kinds: [listEvent.kind as number],
      authors: [listEvent.pubkey],
      since: unixTimeNowInSeconds() - 10,
      limit: 1,
    },
    enabled: sent,
  });
  useEffect(() => {
    if (events.length) {
      console.log("Done!");
      setIsLoading(false);
      toast.success("Calendar Updated!");
      modal?.hide();
    }
  }, [events]);

  async function handleSubmit(listData: EditListType) {
    setIsLoading(true);
    const newTags = Object.entries(listData);
    setSent(true);
    const result = await updateList(
      ndk!,
      { ...listEvent, content: listData.about ?? "" },
      newTags,
    );
  }
  const defaultValues: Partial<EditListType> = {
    name: getTagValues("name", listEvent.tags),
    image:
      getTagValues("image", listEvent.tags) ??
      getTagValues("picture", listEvent.tags),
    banner: getTagValues("banner", listEvent.tags),
    about: listEvent.content,
  };

  return (
    <FormModal
      title="Edit Calendar"
      fields={[
        {
          label: "Name",
          type: "input",
          slug: "name",
        },
        {
          label: "About",
          type: "text-area",
          slug: "about",
        },
        {
          label: "Image",
          type: "upload",
          slug: "image",
        },
        {
          label: "Banner Image",
          type: "upload",
          slug: "banner",
        },
      ]}
      defaultValues={defaultValues ?? {}}
      formSchema={EditCalendarSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Save Changes",
      }}
    />
  );
}
