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
import { getUrls } from "@/components/TextRendering";
import { log } from "@/lib/utils";
const ShortTextNoteSchema = z.object({
  content: z.string(),
  isPrivate: z.boolean().optional(),
  subscriptionTiers: z.string().array().optional(),
});

type ShortTextNoteType = z.infer<typeof ShortTextNoteSchema>;

export default function ShortTextNoteModal() {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, initSubscriptions, mySubscription } = useCurrentUser();
  const [sent, setSent] = useState(false);
  const { ndk } = useNDK();
  const { getSigner } = useSigner()!;

  useEffect(() => {
    if (currentUser) {
      void initSubscriptions(currentUser.pubkey);
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
    const urls = getUrls(data.content);
    const urlTags = urls.map((u) => ["r", u]);
    if (data.isPrivate) {
      if (!mySubscription) {
        toast.error("No list found");
        return;
      }
      let delegateSigner: SignerStoreItem | undefined = undefined;
      if (data.isPrivate) {
        delegateSigner = await getSigner(mySubscription);
        if (!delegateSigner?.signer) {
          toast.error("Error creating signer");
          return;
        }
        if (!delegateSigner?.saved) {
          console.log("Saving delegate...");
          await saveEphemeralSigner(ndk!, delegateSigner.signer, {
            associatedEvent: mySubscription,
            keyProfile: {
              name: delegateSigner.title,
              picture: currentUser?.profile?.image,
              lud06: currentUser?.profile?.lud06,
              lud16: currentUser?.profile?.lud16,
            },
          });
        }
      }
      log(
        "info",
        "about to create private event with ",
        JSON.stringify(delegateSigner),
      );
      const result = await createEventHandler(
        ndk,
        {
          content: data.content,
          kind: 1,
          tags: [...urlTags],
        },
        data.isPrivate,
        mySubscription,
        delegateSigner?.signer,
      );
      if (result) {
        toast.success("Note added!");
        modal?.hide();
      }
    } else {
      const result = await createEventHandler(ndk, {
        content: data.content,
        kind: 1,
        tags: [...urlTags],
      });
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
        ...(mySubscription
          ? ([
              {
                label: "Subs only",
                type: "toggle",
                slug: "isPrivate",
              },
            ] as const)
          : []),

        // {
        //   label: "Choose Tiers",
        //   type: "select-search",
        //   placeholder: "Search your lists",
        //   slug: "subscriptionTiers",
        //   options: lists
        //     .map((l) => {
        //       const title =
        //         getTagValues("title", l.tags) ??
        //         getTagValues("name", l.tags) ??
        //         "Untitled";
        //       const description = getTagValues("description", l.tags);
        //       const value = getTagValues("d", l.tags);
        //       if (!value) return;
        //       return {
        //         label: title,
        //         description,
        //         value: value,
        //       };
        //     })
        //     .filter(Boolean),
        //   condition: "subscriptions",
        // },
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
