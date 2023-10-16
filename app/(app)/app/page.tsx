import dynamic from "next/dynamic";
import ExploreCreators from "./_sections/ExploreCreators";
import LongFormContentSection from "./_sections/LongFormContent";
import BecomeACreator from "./_sections/BecomeACreator";

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
