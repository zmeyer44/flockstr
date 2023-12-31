"use client";
import useEvents from "@/lib/hooks/useEvents";
import {
  type NDKEvent,
  type NDKKind,
  type NDKFilter,
} from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";
import { fromUnix, daysOffset } from "@/lib/utils/dates";
import Spinner from "@/components/spinner";
import CalendarSection, { CalendarSectionLoading } from "./CalendarSection";
import { uniqBy } from "ramda";
type EventsTimelineProps = {
  filter?: NDKFilter;
  loader?: () => JSX.Element;
  empty?: () => JSX.Element;
};
export default function EventsTimeline({
  filter,
  loader: Loader,
  empty: Empty,
}: EventsTimelineProps) {
  const { events, isLoading } = useEvents({
    filter: { kinds: [31923 as NDKKind], ...filter },
  });
  const eventsByDay = groupEventsByDay(
    uniqBy((e) => getTagValues("d", e.tags), events),
  );

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
export function groupEventsByDay(events: NDKEvent[]) {
  const eventDays: Record<string, NDKEvent[]> = {};
  for (const event of events) {
    const eventStartTime = getTagValues("start", event.tags);

    if (!eventStartTime) continue;
    const startDate = fromUnix(parseInt(eventStartTime));
    const daysAway = daysOffset(startDate);
    if (daysAway < 1) {
      if (eventDays[`0`]) {
        eventDays[`0`]!.push(event);
      } else {
        eventDays[`0`] = [event];
      }
    } else if (eventDays[`${daysAway}`]) {
      eventDays[`${daysAway}`]!.push(event);
    } else {
      eventDays[`${daysAway}`] = [event];
    }
  }
  const groupedArray = Object.entries(eventDays)
    .sort(([aKey], [bKey]) => {
      const aDay = parseInt(aKey);
      const bDay = parseInt(bKey);
      if (aDay > bDay) {
        return 1;
      } else if (aDay < bDay) {
        return -1;
      }
      return 0;
    })
    .map(([_, events]) =>
      events.sort((a, b) => {
        const aStart = parseInt(getTagValues("start", a.tags) ?? "0");
        const bStart = parseInt(getTagValues("start", b.tags) ?? "0");
        if (aStart > bStart) {
          return 1;
        } else if (aStart < bStart) {
          return -1;
        }
        return 0;
      }),
    );
  return groupedArray;
}
