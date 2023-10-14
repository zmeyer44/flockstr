import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function BecomeACreator() {
  return (
    <div className="padded-container overflow-x-clip pb-8 max-sm:-mx-5 md:py-[120px]">
      <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row">
        <Image
          alt="creator icons"
          width={512}
          height={210.82}
          src={
            "https://whop.com/_next/image/?url=%2Fv2%2Fhomepage-whop-sellers-grid.png&w=1080&q=75"
          }
          className="h-44 object-cover object-bottom lg:h-auto"
        />
        <div className="max-sm:px-5 md:self-start lg:max-w-lg lg:self-center">
          <h2 className="font-condensed text-2xl font-bold text-foreground sm:text-3xl">
            Start earning on Nostr
          </h2>
          <div className="mb-6 mt-2 text-muted-foreground">
            Start earning bitcoin from your content. Create lists that for fans
            can subscribe to!
          </div>
          <Button>Become a Creator</Button>
        </div>
      </div>
    </div>
  );
}
