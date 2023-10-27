"use client";
import { NDKEvent, type NDKKind } from "@nostr-dev-kit/ndk";
import CalendarSection, {
  CalendarSectionLoading,
} from "./_components/CalendarSection";
import useEvents from "@/lib/hooks/useEvents";
import { getTagValues } from "@/lib/nostr/utils";
import { fromUnix, daysOffset } from "@/lib/utils/dates";
export default function Page() {
  const { events, isLoading } = useEvents({
    filter: {
      kinds: [31923 as NDKKind],
      limit: 100,
    },
  });
  const eventsByDay = groupEventsByDay(events);

  if (isLoading && !eventsByDay.length) {
    return (
      <div className="relative flex-col px-5 pt-5 sm:pt-7">
        <div className="mx-auto max-w-[900px] space-y-4">
          <CalendarSectionLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-col px-5 pt-5 sm:pt-7">
      <div className="mx-auto max-w-[900px] space-y-4">
        {eventsByDay.map((e) => (
          <CalendarSection events={e} />
        ))}
      </div>
    </div>
  );
}

function groupEventsByDay(events: NDKEvent[]) {
  const eventDays: Record<string, NDKEvent[]> = {};
  for (const event of events) {
    const eventStartTime = getTagValues("start", event.tags);
    if (!eventStartTime) continue;
    const startDate = fromUnix(parseInt(eventStartTime));
    const daysAway = daysOffset(startDate);
    if (daysAway < 1) continue;
    if (eventDays[`${daysAway}`]) {
      eventDays[`${daysAway}`]!.push(event);
    } else {
      eventDays[`${daysAway}`] = [event];
    }
  }
  const groupedArray = Object.entries(eventDays)
    .sort(([aKey], [bKey, test]) => {
      console.log("test", test);
      const aDay = parseInt(aKey);

      const bDay = parseInt(bKey);
      if (aDay > bDay) {
        return 1;
      } else if (aDay < bDay) {
        return -1;
      }
      return 0;
    })
    .map(([_, events]) => events);
  console.log("object", eventDays);
  console.log("returing", groupedArray);
  return groupedArray;
}
