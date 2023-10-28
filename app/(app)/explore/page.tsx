import dynamic from "next/dynamic";
import ExploreCreators from "./_sections/ExploreCreators";
import UpcomingEvents from "./_sections/UpcomingEvents";
import LongFormContentSection from "./_sections/LongFormContent";
import CreateEvents from "./_sections/CreateEvents";

const LiveStreamingSection = dynamic(
  () => import("./_sections/LiveStreaming"),
  {
    ssr: false,
  },
);
const FeaturedListsSection = dynamic(
  () => import("./_sections/FeaturedLists"),
  {
    ssr: false,
  },
);
const NewEventButton = dynamic(() => import("./_components/NewEventButton"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="relative space-y-6 px-5 pt-5 sm:pt-7">
      <ExploreCreators />
      <UpcomingEvents />
      <LongFormContentSection />
      <CreateEvents />
      <LiveStreamingSection />
      <FeaturedListsSection />
      <div className="fixed bottom-[calc(var(--bottom-nav-height)_+_20px)] right-[20px] z-overlay- sm:hidden">
        <NewEventButton />
      </div>
    </div>
  );
}
