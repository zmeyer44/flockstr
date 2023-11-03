"use client";
import { useState, useEffect } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagsValues } from "@/lib/nostr/utils";
import { groupEventsByDay } from ".";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import CalendarSection, { CalendarSectionLoading } from "./CalendarSection";
import useEvents from "@/lib/hooks/useEvents";
type EventsFromCalendar = {
  calendar: NDKEvent;
  secondaryFilter?: (event: NDKEvent) => Boolean;
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
};

export default function EventsFromCalendar({
  calendar,
  secondaryFilter,
  loader: Loader,
  empty: Empty,
}: EventsFromCalendar) {
  const calendarEvents = getTagsValues("a", calendar.tags);
  const [eventsByDay, setEventsByDay] = useState<NDKEvent[][]>([]);

  const calendarEventIdentifiers = calendarEvents
    .filter(Boolean)
    .map((e) => {
      if (nip19.BECH32_REGEX.test(e) && e.includes(":")) {
        const [kind, pubkey, identifier] = e.split(":") as [
          string,
          string,
          string,
        ];
        return {
          type: "naddr",
          data: {
            kind,
            pubkey,
            identifier,
          },
        };
      } else {
        return nip19.decode(e);
      }
    })
    .filter(({ type }) => type === "naddr")
    .map((e) => e.data as nip19.AddressPointer);
  const { events, isLoading } = useEvents({
    filter: {
      kinds: calendarEventIdentifiers.map((k) => k.kind),
      authors: calendarEventIdentifiers.map((k) => k.pubkey),
      ["#d"]: calendarEventIdentifiers.map((k) => k.identifier),
    },
  });
  useEffect(() => {
    if (events) {
      if (secondaryFilter) {
        const grouped = groupEventsByDay(events.filter(secondaryFilter));
        console.log("rouped events", grouped);
        setEventsByDay(grouped);
      } else {
        const grouped = groupEventsByDay(events);
        setEventsByDay(grouped);
      }
    }
  }, [events]);
  if (isLoading) {
    if (Loader) {
      return <Loader />;
    }
    return <CalendarSectionLoading />;
  }
  if (Empty && eventsByDay.length === 0) {
    return <Empty />;
  }
  return (
    <>
      {eventsByDay.map((e) => (
        <CalendarSection events={e} />
      ))}
    </>
  );
}
