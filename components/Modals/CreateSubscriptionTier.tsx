import { useState } from "react";
import FormModal from "./FormModal";
import { z } from "zod";
import { useModal } from "@/app/_providers/modal/provider";
import { toast } from "sonner";
import { randomId } from "@/lib/nostr";
import { satsToBtc } from "@/lib/utils";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { useSigner, type SignerStoreItem } from "@/app/_providers/signer";
import { createEvent, updateList } from "@/lib/actions/create";
import { getTagValues } from "@/lib/nostr/utils";
import { NDKList, NDKUser } from "@nostr-dev-kit/ndk";
import { saveEphemeralSigner } from "@/lib/actions/ephemeral";
import { useRouter } from "next/navigation";
import { log } from "@/lib/utils";
import { follow } from "@/lib/actions/create";

const CreateSubscriptionTierSchema = z.object({
  title: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
});

type CreateSubscriptionTierType = z.infer<typeof CreateSubscriptionTierSchema>;

export default function CreateSubscriptionTier() {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const router = useRouter();

  const { currentUser, initSubscriptions } = useCurrentUser();
  const { ndk } = useNDK();
  const { getSigner } = useSigner()!;

  async function handleSubmit(data: CreateSubscriptionTierType) {
    if (!currentUser) return;
    setIsLoading(true);
    const random = randomId();
    const tags = [
      ["title", data.title],
      ["name", data.title],
      ["d", random],
      ["p", currentUser!.pubkey, "", "self", "4000000000"],
    ];

    if (data.description) {
      tags.push(["description", data.description]);
      tags.push(["summary", data.description]);
    }
    if (data.image) {
      tags.push(["image", data.image]);
      tags.push(["picture", data.image]);
    }
    if (data.price) {
      tags.push(["price", satsToBtc(data.price).toString(), "btc", "year"]);
    }
    const event = await createEvent(ndk!, {
      content: "",
      kind: 30044,
      tags: tags,
    });
    if (event) {
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
        .then(async (savedSigner) => {
          await updateList(ndk!, event.rawEvent(), [
            ["delegate", savedSigner.pubkey],
          ]);
          return savedSigner.pubkey;
        })
        .then((delegate) => follow(ndk!, currentUser, delegate))
        .catch((err) => console.log("Error creating delegate"));
    }
    // getSubscriptionTiers(currentUser!.hexpubkey);
    setIsLoading(false);
    if (event) {
      initSubscriptions(currentUser.pubkey);
      toast.success("Subscription Tier Created!");
      modal?.hide();
      router.push(`/sub/${event.encode()}`);
    } else {
      toast.error("An error occured");
    }
  }
  return (
    <FormModal
      title="Create Subscription Tier"
      fields={[
        {
          label: "Tier name",
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
          label: "Price",
          subtitle: "sats/year",
          type: "number",
          slug: "price",
        },
      ]}
      formSchema={CreateSubscriptionTierSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Create Subscription Tier",
      }}
    />
  );
}
