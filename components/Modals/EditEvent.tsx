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
import { addMinutesToDate, fromUnix, toUnix } from "@/lib/utils/dates";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { nip19 } from "nostr-tools";
const EditListSchema = z.object({
  name: z.string(),
  about: z.string().optional(),
  image: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  calendar: z.string().optional(),
});

type EditListType = z.infer<typeof EditListSchema>;

type EditListModalProps = {
  listEvent: NostrEvent;
};
export default function EditListModal({ listEvent }: EditListModalProps) {
  const modal = useModal();
  const { currentUser, calendars } = useCurrentUser();
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
      toast.success("Event Updated!");
      modal?.hide();
    }
  }, [events]);

  async function handleSubmit(listData: EditListType) {
    setIsLoading(true);
    const dateKeys = ["start", "end"];
    const removeKeys = [""];
    const newTags = Object.entries(listData)
      .map(([key, val]) => {
        if (dateKeys.includes(key)) {
          const unix = toUnix(new Date(val));
          return [key, unix.toString()];
        } else if (removeKeys.includes(key)) {
          return;
        } else {
          return [key, val];
        }
      })
      .filter(Boolean) as [string, string][];
    const result = await updateList(
      ndk!,
      { ...listEvent, content: listData.about ?? "" },
      newTags,
    );
    console.log("listData.calendar", listData.calendar);
    if (listData.calendar) {
      const selectedCalendar = Array.from(calendars)
        .find((option) => option.tagId() === listData.calendar)
        ?.rawEvent();
      console.log("selectedCalendar", selectedCalendar);

      if (selectedCalendar) {
        const encodedEvent = nip19.naddrEncode({
          identifier: getTagValues("d", listEvent.tags) as string,
          kind: listEvent.kind as number,
          pubkey: listEvent.pubkey,
        });
        await updateList(ndk!, selectedCalendar, [["a", encodedEvent]]);
      }
    }
    setSent(true);
  }
  const defaultValues: Partial<EditListType> = {
    name:
      getTagValues("title", listEvent.tags) ??
      getTagValues("name", listEvent.tags),
    image:
      getTagValues("image", listEvent.tags) ??
      getTagValues("picture", listEvent.tags),
    about: listEvent.content,
    start: getTagValues("start", listEvent.tags)
      ? fromUnix(
          parseInt(getTagValues("start", listEvent.tags) as string),
        ).toISOString()
      : new Date().toISOString(),
    end: getTagValues("end", listEvent.tags)
      ? fromUnix(
          parseInt(getTagValues("end", listEvent.tags) as string),
        ).toISOString()
      : addMinutesToDate(new Date(), 60).toISOString(),
    calendar: getTagValues("calendar", listEvent.tags),
  };

  return (
    <FormModal
      title="Edit Event"
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
          label: "Start",
          type: "date-time",
          slug: "start",
        },
        {
          label: "End",
          type: "date-time",
          slug: "end",
        },
        {
          label: "Link Calendar",
          type: "select",
          slug: "calendar",
          options: Array.from(calendars).map((o) => ({
            value: o.tagId(),
            label: getTagValues("name", o.tags) as string,
          })),
        },
      ]}
      defaultValues={defaultValues ?? {}}
      formSchema={EditListSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cta={{
        text: "Save Changes",
      }}
    />
  );
}
