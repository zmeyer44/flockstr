import { useEffect, useState } from "react";
import FormModal from "./FormModal";
import { z } from "zod";
import useEvents from "@/lib/hooks/useEvents";
import { createEvent } from "@/lib/actions/create";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { useModal } from "@/app/_providers/modal/provider";
import { toast } from "sonner";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

const EditProfileSchema = z.object({
  display_name: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
  about: z.string().optional(),
  banner: z.string().optional(),
  website: z.string().optional(),
  nip05: z.string().optional(),
  lud16: z.string().optional(),
});

type EditProfileType = z.infer<typeof EditProfileSchema>;

export default function EditProfileModal() {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { ndk } = useNDK();
  const { currentUser, updateUser } = useCurrentUser();
  const { events } = useEvents({
    filter: {
      kinds: [0],
      authors: [currentUser?.pubkey ?? ""],
      since: unixTimeNowInSeconds() - 10,
      limit: 1,
    },
    enabled: sent,
  });
  useEffect(() => {
    if (events.length) {
      console.log("Done!");
      setIsLoading(false);
      toast.success("Profile Updated!");
      modal?.hide();
    }
  }, [events]);

  async function handleSubmit(userData: EditProfileType) {
    setIsLoading(true);
    const content = JSON.stringify(userData);
    const result = await createEvent(ndk!, {
      content,
      kind: 0,
      tags: [],
    });
    if (result) {
      updateUser(JSON.stringify({ ...userData, npub: currentUser?.npub }));
    }
    setSent(true);
  }

  return (
    <FormModal
      title="Edit List"
      fields={[
        {
          label: "Display name",
          type: "input",
          slug: "display_name",
        },
        {
          label: "Name",
          type: "input",
          slug: "name",
        },
        {
          label: "Image",
          type: "input",
          slug: "image",
        },
        {
          label: "About",
          type: "text-area",
          slug: "about",
        },
        {
          label: "Banner",
          type: "input",
          slug: "banner",
        },
        {
          label: "Website",
          type: "input",
          slug: "website",
        },
        {
          label: "NIP-05",
          type: "input",
          slug: "nip05",
          placeholder: "name@example.com",
        },
        {
          label: "Bitcoin lightning address (lud16)",
          type: "input",
          slug: "lud16",
        },
      ]}
      defaultValues={{
        ...currentUser?.profile,
        display_name: currentUser?.profile?.displayName,
      }}
      formSchema={EditProfileSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Save Changes",
      }}
    />
  );
}
