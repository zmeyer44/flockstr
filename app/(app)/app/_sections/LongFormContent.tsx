import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionContent,
} from "@/containers/PageSection";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "react-icons/ri";
import KindCard from "@/components/KindCard";
import { DUMMY_30023 } from "@/constants";
import Link from "next/link";
export default function LongFormContentSection() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Long form content</SectionTitle>
        <Button variant={"ghost"}>
          View all <RiArrowRightLine className="ml-1 h-4 w-4" />
        </Button>
      </SectionHeader>
      <SectionContent className="sm:lg-feed-cols relative mx-auto flex flex-col gap-4">
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
        <Link href="/article/ere">
          <KindCard {...DUMMY_30023} />
        </Link>
      </SectionContent>
    </Section>
  );
}
