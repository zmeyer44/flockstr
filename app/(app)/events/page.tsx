import { type NDKKind } from "@nostr-dev-kit/ndk";
import EventsTimeline from "@/containers/EventsTimeline";
export default function EventsPage() {
  return (
    <div className="relative flex-col space-y-6 px-5 pt-5 sm:pt-7">
      <div className="flex items-center justify-between px-0 sm:px-5">
        <h2 className="font-condensed text-2xl font-bold sm:text-3xl">
          Upcoming Events
        </h2>
      </div>
      <div className="mx-auto max-w-[900px] space-y-6">
        <EventsTimeline filter={{ kinds: [31923 as NDKKind], limit: 100 }} />
      </div>
    </div>
  );
}
