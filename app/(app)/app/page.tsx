import { Button } from "@/components/ui/button";
import HorizontalCarousel from "./_sections/HorizontalCarousel";
import { RiArrowRightLine } from "react-icons/ri";
import LongFormContentCard from "@/components/LongFormContentCard";
import BecomeACreator from "./_sections/BecomeACreator";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import LiveStreamingSection from "./_sections/LiveStreaming";
import FeaturedListsSection from "./_sections/FeaturedLists";

export default function Page() {
  return (
    <div className="relative space-y-6 pt-5 sm:pt-7">
      <section className="relative -mx-5 space-y-4 overflow-x-hidden sm:space-y-6">
        <div className="flex items-center justify-between px-5 max-sm:pr-3">
          <h2 className="font-condensed text-2xl font-bold sm:text-3xl">
            Explore Creators
          </h2>
          <Button variant={"ghost"}>
            View all <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <HorizontalCarousel />
      </section>
      <Section>
        <SectionHeader>
          <SectionTitle>Long form content</SectionTitle>
          <Button variant={"ghost"}>
            View all <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Button>
        </SectionHeader>
        <SectionContent className="sm:lg-feed-cols relative mx-auto flex flex-col gap-4">
          <LongFormContentCard />
          <LongFormContentCard />
          <LongFormContentCard />
          <LongFormContentCard />
        </SectionContent>
      </Section>
      <BecomeACreator />
      <LiveStreamingSection />
      <FeaturedListsSection />
    </div>
  );
}
