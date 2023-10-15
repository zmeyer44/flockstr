import ExploreCreators from "./_sections/ExploreCreators";
import BecomeACreator from "./_sections/BecomeACreator";
import LiveStreamingSection from "./_sections/LiveStreaming";
import FeaturedListsSection from "./_sections/FeaturedLists";
import LongFormContentSection from "./_sections/LongFormContent";

export default function Page() {
  return (
    <div className="relative space-y-6 pt-5 sm:pt-7">
      <ExploreCreators />
      <LongFormContentSection />
      <BecomeACreator />
      <LiveStreamingSection />
      <FeaturedListsSection />
    </div>
  );
}
