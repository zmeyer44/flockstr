import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import LiveBadge from "@/components/Badges/LiveBadge";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import VideoCard from "@/components/VideoCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export default function LiveStreamingSection() {
  const demo = [
    {
      id: 1,
      title: "BTC Radio",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/51602.original.png?1693358530",
      tags: ["music", "crypto", "art"],
    },
    {
      id: 2,
      title: "The Book of Alpha: NFTs and crypto taking over. Market Talk",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/31095.thumbnail.png?1692203850",
      tags: ["NFTs", "crypto", "art", "trading"],
    },
    {
      id: 3,
      title: "Space Talk: What's Elon up to?",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/40088.original.png?1692206315",
      tags: ["Space"],
    },
    {
      id: 4,
      title: "The Book of Alpha: NFTs and crypto taking over. Market Talk",
      picture:
        "https://assets.whop.com/cdn-cgi/image/width=1080/https://assets.whop.com/images/images/40680.original.png?1692206434",
      tags: ["Market"],
    },
  ];
  return (
    <Section className="max-sm:-mx-5">
      <SectionHeader>
        <div className="center gap-x-2 max-sm:px-5">
          <SectionTitle>Streaming Now</SectionTitle>
          <LiveBadge text={"LIVE"} />
        </div>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="relative">
        <ScrollArea>
          <div className="flex space-x-2 pb-4 max-sm:px-5">
            {demo.map((item) => (
              <VideoCard
                key={item.id}
                card={item}
                className="min-w-[250px] max-w-[350px]"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SectionContent>
    </Section>
  );
}
