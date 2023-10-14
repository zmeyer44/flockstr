import { Button } from "@/components/ui/button";
import HorizontalCarousel from "./_sections/HorizontalCarousel";
import { RiArrowRightLine } from "react-icons/ri";
import LongFormContentCard from "@/components/LongFormContentCard";
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
      <section className="relative space-y-3 overflow-x-hidden sm:space-y-3">
        <div className="flex items-center justify-between  max-sm:pr-3">
          <h2 className="font-condensed text-xl font-semibold sm:text-xl">
            Long form content
          </h2>
          <Button variant={"ghost"}>
            View all <RiArrowRightLine className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="relative grid gap-4">
          <LongFormContentCard />
          <LongFormContentCard />
          <LongFormContentCard />
          <LongFormContentCard />
        </div>
      </section>
    </div>
  );
}
