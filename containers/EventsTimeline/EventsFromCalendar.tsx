"use client";
import { useState, useEffect } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagAllValues } from "@/lib/nostr/utils";
import { groupEventsByDay } from ".";
import { useNDK } from "@/app/_providers/ndk";
import { nip19 } from "nostr-tools";
import CalendarSection, { CalendarSectionLoading } from "./CalendarSection";

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
  const calendarEvents = getTagAllValues("a", calendar.tags);
  const { ndk } = useNDK();
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const calendarEventIdentifiers = calendarEvents
    .map((e) => nip19.decode(e))
    .filter(({ type }) => type === "naddr")
    .map((e) => e.data as nip19.AddressPointer);

  async function handleFetchEvents(data: nip19.AddressPointer[]) {
    if (!ndk) return;
    setIsFetching(true);
    const events: NDKEvent[] = [];
    const promiseArray = [];
    for (const info of data) {
      const calendarEventPromise = ndk
        .fetchEvent({
          authors: [info.pubkey],
          ["#d"]: [info.identifier],
          kinds: [info.kind],
        })
        .then((e) => e && events.push(e))
        .catch((err) => console.log("err"));
      promiseArray.push(calendarEventPromise);
    }
    await Promise.all(promiseArray);
    setEvents(events);
    setIsFetching(false);
  }

  useEffect(() => {
    if (
      !ndk ||
      calendarEventIdentifiers.length === 0 ||
      isFetching ||
      events.length
    )
      return;
    handleFetchEvents(calendarEventIdentifiers);
  }, [ndk, calendarEventIdentifiers]);

  const eventsByDay = groupEventsByDay(events);

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
