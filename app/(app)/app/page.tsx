import dynamic from "next/dynamic";
import Link from "next/link";
import ExploreCreators from "./_sections/ExploreCreators";
import LongFormContentSection from "./_sections/LongFormContent";
import BecomeACreator from "./_sections/BecomeACreator";
import { RiAddFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
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
      <div className="z-overlay- fixed bottom-[calc(var(--bottom-nav-height)_+_20px)] right-[15px] sm:hidden">
        <Link href="/article/new">
          <Button size={"icon"} className="h-[50px] w-[50px]">
            <RiAddFill className="h-[32px] w-[32px]" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
