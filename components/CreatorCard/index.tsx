import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CreatorCardProps = {
  displayName: string;
  about: string;
  picture: string;
  banner: string;
};

export default function CreatorCard({
  banner,
  displayName,
  picture,
  about,
}: CreatorCardProps) {
  const recentEvents = [
    {
      id: "test",
      title: "How to start building a following on nostr.",
      summary:
        "Starting on a new protocol could be intinidating, But there is no reason to fret. I've got it all under control.",
    },
    {
      id: "asg",
      title: "Jumping through relays",
      summary: "Getting used to different relays and how to find them",
    },
    {
      id: "ant",
      title: "Nostrasia is coming",
      summary: "Time to start preping for Nostraisa.",
    },
  ];
  return (
    <Card className="relative h-[350px] w-[250px] min-w-[250] overflow-hidden">
      <Image
        alt="background"
        src={banner}
        className="absolute inset-0 object-cover"
        fill
        unoptimized
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all">
        <div className="group relative flex h-full w-full flex-col items-center justify-end transition-all">
          <CardHeader className="absolute inset-x-0 top-[59%] transform pt-4 text-center transition-all duration-300 group-hover:top-0 group-hover:ml-[70px] group-hover:text-left">
            <CardTitle>{displayName}</CardTitle>
            <CardDescription className="line-clamp-3 group-hover:text-xs">
              {about}
            </CardDescription>
          </CardHeader>
          <Image
            alt="user"
            src={picture}
            className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-[70%] transform overflow-hidden rounded-lg object-cover transition-all duration-300 group-hover:left-[45px] group-hover:top-[60px] group-hover:w-[70px]"
            height={100}
            width={100}
            unoptimized
          />
          <Card className="absolute top-full min-h-full w-5/6 overflow-hidden transition-all duration-300 group-hover:top-1/3">
            <CardHeader className="border-b p-4 pb-3">
              <CardTitle>Recent work:</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden px-0">
              <ul>
                {recentEvents.map((item) => (
                  <li key={item.id} className="overflow-hidden">
                    <Link
                      href={""}
                      className="flex max-w-fit items-center justify-between overflow-hidden py-1.5 pl-4 pr-2 transition-colors hover:bg-muted hover:text-primary"
                    >
                      <div className="shrink">
                        <h4 className="line-clamp-1 text-sm font-semibold text-card-foreground">
                          {item.title}
                        </h4>
                        <p className="line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                          {item.summary}
                        </p>
                      </div>
                      <div className="center shrink-0 pl-2">
                        <RiArrowRightLine className="h-5 w-5" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
}
