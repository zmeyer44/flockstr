import { useState } from "react";
import FormModal from "./FormModal";
import { z } from "zod";
import { useModal } from "@/app/_providers/modal/provider";
import { toast } from "sonner";
import { generateRandomString } from "@/lib/nostr";
import { satsToBtc } from "@/lib/utils";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { useSigner, type SignerStoreItem } from "@/app/_providers/signer";
import { createEvent } from "@/lib/actions/create";
import { getTagValues } from "@/lib/nostr/utils";
import { NDKList } from "@nostr-dev-kit/ndk";
import { saveEphemeralSigner } from "@/lib/actions/ephemeral";
import { useRouter } from "next/navigation";

const CreateListSchema = z.object({
  title: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  subscriptions: z.boolean(),
  price: z.number().optional(),
});

type CreateListType = z.infer<typeof CreateListSchema>;

export default function CreateList() {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const router = useRouter();

  const { currentUser, updateUser } = useCurrentUser();
  const { ndk } = useNDK();
  const { getSigner } = useSigner()!;
  async function handleSubmit(data: CreateListType) {
    setIsLoading(true);
    const random = generateRandomString();
    const tags = [
      ["title", data.title],
      ["name", data.title],
      ["d", random],
    ];
    if (data.description) {
      tags.push(["description", data.description]);
      tags.push(["summary", data.description]);
    }
    if (data.image) {
      tags.push(["image", data.image]);
      tags.push(["picture", data.image]);
    }
    if (data.subscriptions) {
      tags.push(["subscriptions", "true"]);
      tags.push(["p", currentUser!.pubkey, "", "self", "4000000000"]);
    }
    if (data.price) {
      tags.push(["price", satsToBtc(data.price).toString(), "btc", "year"]);
    }
    const event = await createEvent(ndk!, {
      content: "",
      kind: 30001,
      tags: tags,
    });
    if (event && getTagValues("subscriptions", event.tags)) {
      await getSigner(new NDKList(ndk, event.rawEvent()))
        .then((delegateSigner) =>
          saveEphemeralSigner(ndk!, delegateSigner.signer, {
            associatedEvent: event,
            keyProfile: {
              name: delegateSigner.title,
              picture: currentUser?.profile?.image,
              lud06: currentUser?.profile?.lud06,
              lud16: currentUser?.profile?.lud16,
            },
          }),
        )
        .then(
          (savedSigner) => savedSigner,
          //   updateList(ndk!, event.rawEvent(), [
          //     ["delegate", savedSigner.hexpubkey],
          //   ]),
        )
        .catch((err) => console.log("Error creating delegate"));
    }
    // getLists(currentUser!.hexpubkey);
    setIsLoading(false);
    if (event) {
      toast.success("List Created!");
      modal?.hide();
      router.push(`/list/${event.encode()}`);
    } else {
      toast.error("An error occured");
    }
  }
  return (
    <FormModal
      title="Create List"
      fields={[
        {
          label: "Title",
          type: "input",
          slug: "title",
        },
        {
          label: "Description",
          type: "text-area",
          slug: "description",
        },
        {
          label: "Image",
          type: "input",
          slug: "image",
        },
        {
          label: "Enable subscriptions",
          type: "toggle",
          slug: "subscriptions",
        },
        {
          label: "Price",
          subtitle: "sats/year",
          type: "number",
          slug: "price",
          condition: "subscriptions",
        },
      ]}
      formSchema={CreateListSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Create List",
      }}
    />
  );
}
