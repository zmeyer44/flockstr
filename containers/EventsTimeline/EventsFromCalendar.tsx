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
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
};

export default function EventsFromCalendar({
  calendar,
  loader: Loader,
  empty: Empty,
}: EventsFromCalendar) {
  const calendarEvents = getTagsValues("a", calendar.tags);
  const { ndk } = useNDK();
  const [eventsByDay, setEventsByDay] = useState<NDKEvent[][]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const calendarEventIdentifiers = calendarEvents
    .filter(Boolean)
    .map((e) => nip19.decode(e))
    .filter(({ type }) => type === "naddr")
    .map((e) => e.data as nip19.AddressPointer);
  const { events } = useEvents({
    filter: {
      kinds: calendarEventIdentifiers.map((k) => k.kind),
      authors: calendarEventIdentifiers.map((k) => k.pubkey),
      ["#d"]: calendarEventIdentifiers.map((k) => k.identifier),
    },
  });
  // async function handleFetchEvents(data: nip19.AddressPointer[]) {
  //   if (!ndk) return;
  //   setIsFetching(true);
  //   const events: NDKEvent[] = [];
  //   const promiseArray = [];
  //   for (const info of data) {
  //     console.log("INFO", info);
  //     const calendarEventPromise = ndk
  //       .fetchEvent({
  //         authors: [info.pubkey],
  //         ["#d"]: [info.identifier],
  //         kinds: [info.kind],
  //       })
  //       .then((e) => e && events.push(e))
  //       .catch((err) => console.log("err"));
  //     promiseArray.push(calendarEventPromise);
  //   }
  //   await Promise.all(promiseArray);
  //   setEvents(events);
  //   setIsFetching(false);
  // }

  // useEffect(() => {
  //   if (
  //     !ndk ||
  //     calendarEventIdentifiers.length === 0 ||
  //     isFetching ||
  //     events.length
  //   )
  //     return;
  //   handleFetchEvents(calendarEventIdentifiers);
  // }, [ndk, calendarEventIdentifiers]);

  useEffect(() => {
    if (events) {
      const grouped = groupEventsByDay(events);
      console.log("Runnign group", events, " to", grouped);
      setEventsByDay(grouped);
    }
  }, [events]);
  console.log(eventsByDay);
  if (isFetching) {
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
