import { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { createEventHandler } from "@/lib/actions/create";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modal/provider";
import { toast } from "sonner";
import { useNDK } from "@/app/_providers/ndk";
import { useSigner, type SignerStoreItem } from "@/app/_providers/signer";
import { getTagValues } from "@/lib/nostr/utils";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { saveEphemeralSigner } from "@/lib/actions/ephemeral";
import useLists from "@/lib/hooks/useLists";

const ShortTextNoteSchema = z.object({
  content: z.string(),
  list: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

type ShortTextNoteType = z.infer<typeof ShortTextNoteSchema>;

export default function ShortTextNoteModal() {
  const modal = useModal();
  const { lists, init } = useLists();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useCurrentUser();
  const [sent, setSent] = useState(false);
  const { ndk } = useNDK();
  const { getSigner } = useSigner()!;

  useEffect(() => {
    if (currentUser) {
      void init(currentUser.pubkey);
    }
  }, [currentUser]);

  //   useEffect(() => {
  //     if (events.length) {
  //       console.log("Done!");
  //       setIsLoading(false);
  //       toast.success("List Updated!");
  //       modal?.hide();
  //     }
  //   }, [events]);

  async function handleSubmit(data: ShortTextNoteType) {
    setIsLoading(true);
    if (!ndk) {
      toast.error("Error connecting");
      return;
    }
    if (data.list) {
      const list = lists.find((l) => getTagValues("d", l.tags) === data.list);
      if (!list) {
        toast.error("No list found");
        return;
      }
      let listSigner: SignerStoreItem | undefined = undefined;
      if (data.isPrivate) {
        listSigner = await getSigner(list);
        if (!listSigner?.signer) {
          toast.error("Error creating signer");
          return;
        }
        if (!listSigner?.saved) {
          console.log("Saving delegate...");
          await saveEphemeralSigner(ndk!, listSigner.signer, {
            associatedEvent: list,
            keyProfile: {
              name: listSigner.title,
              picture: currentUser?.profile?.image,
              lud06: currentUser?.profile?.lud06,
              lud16: currentUser?.profile?.lud16,
            },
          });
        }
      }
      console.log("about to create private event with ", listSigner);
      const result = await createEventHandler(
        ndk,
        {
          content: data.content,
          kind: 1,
          tags: [],
        },
        data.isPrivate,
        list,
        listSigner?.signer,
      );
      if (result) {
        toast.success("Note added!");
        modal?.hide();
      }
    } else {
      const result = await createEventHandler(
        ndk,
        {
          content: data.content,
          kind: 1,
          tags: [],
        },
        data.isPrivate,
      );
      if (result) {
        toast.success("Note added!");
        modal?.hide();
      }
    }
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
          options: lists
            .map((l) => {
              console.log("MApping", l);
              const title =
                getTagValues("title", l.tags) ??
                getTagValues("name", l.tags) ??
                "Untitled";
              const description = getTagValues("description", l.tags);
              const value = getTagValues("d", l.tags);
              if (!value) return;
              return {
                label: title,
                description,
                value: value,
              };
            })
            .filter(Boolean),
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
