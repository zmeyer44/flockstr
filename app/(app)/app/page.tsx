import HorizontalCarousel from "./_sections/HorizontalCarousel";

export default function Page() {
  return (
    <div className="relative pt-10">
      <div className="relative -mx-5 space-y-6 overflow-x-hidden">
        <div className="flex items-center justify-between px-5">
          <h2 className="font-condensed text-3xl font-bold">
            Explore Creators
          </h2>
        </div>
        <HorizontalCarousel />
      </div>
    </div>
  );
}
