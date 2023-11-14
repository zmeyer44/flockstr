"use client";

import { useEffect, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import AvatarStack from "@/components/ProfileContainers/AvatarStack";
import useEvents from "@/lib/hooks/useEvents";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { getTagValues, getTagAllValues } from "@/lib/nostr/utils";
import { removeDuplicates } from "@/lib/utils";
type AttendeesContainerProps = {
  attendees: string[];
  eventReference: string;
};
export default function AttendeesContainer({
  attendees: _attendees,
  eventReference,
}: AttendeesContainerProps) {
  const [attendees, setAttendees] = useState(_attendees);
  const { events } = useEvents({
    filter: {
      kinds: [31925 as NDKKind],
      ["#a"]: [eventReference],
    },
  });

  useEffect(() => {
    const users = events
      .filter((e) => getTagAllValues("l", e.tags).includes("accepted"))
      .map((e) => e.pubkey);

    setAttendees(removeDuplicates([..._attendees, ...users]));
  }, [events]);
  return (
    <div className="overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem]">
      <div className="flex items-center gap-x-3 px-2 pb-2">
        <HiOutlineUserGroup className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Attendees</h3>
      </div>
      <AvatarStack pubkeys={attendees} />
    </div>
  );
}
