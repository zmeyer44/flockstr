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
import { NDKUserProfile } from "@nostr-dev-kit/ndk";
import { BANNER } from "@/constants/app";
import { getNameToShow } from "@/lib/utils";

type CreatorCardProps = {
  profile?: NDKUserProfile;
  npub: string;
  recentWork: {
    id: string;
    title: string;
    summary: string;
    href: string;
  }[];
};

export default function CreatorCard({
  profile,
  npub,
  recentWork,
}: CreatorCardProps) {
  return (
    <Card className="relative h-[350px] w-[250px] min-w-[250] overflow-hidden">
      <Image
        alt="background"
        src={profile?.banner ?? BANNER}
        className="absolute inset-0 object-cover"
        fill
        unoptimized
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all">
        <div className="group relative flex h-full w-full flex-col items-center justify-end transition-all">
          <CardHeader className="absolute inset-x-0 top-[59%] transform pt-4 text-center transition-all duration-300 group-hover:top-[8px] group-hover:ml-[75px] group-hover:text-left">
            <Link href={`/${npub}`}>
              <CardTitle className="hover:underline">
                {getNameToShow({ profile, npub })}
              </CardTitle>
            </Link>
            <CardDescription className="line-clamp-3 group-hover:text-xs">
              {profile?.about}
            </CardDescription>
          </CardHeader>
          <Image
            alt="user"
            src={
              profile?.image ??
              profile?.picture ??
              `https://bitcoinfaces.xyz/api/get-image?name=${npub}&onchain=false`
            }
            className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-[70%] transform overflow-hidden rounded-lg bg-muted object-cover transition-all duration-300 group-hover:left-[50px] group-hover:top-[65px] group-hover:w-[70px]"
            height={100}
            width={100}
            unoptimized
          />
          <Card className="absolute top-full min-h-full w-5/6 overflow-hidden transition-all duration-300 group-hover:top-1/3">
            <CardHeader className="border-b p-4 pb-3">
              <CardTitle>Recent work:</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden px-0">
              <ul className="w-full">
                {recentWork.map((item) => (
                  <li key={item.id} className="w-full overflow-hidden">
                    <Link
                      href={item.href}
                      className="flex max-w-full items-center justify-between overflow-hidden py-1.5 pl-4 pr-2 transition-colors hover:bg-muted hover:text-primary"
                    >
                      <div className="shrink overflow-x-hidden">
                        <h4 className="line-clamp-1 text-sm font-semibold text-card-foreground">
                          {item.title}
                        </h4>
                        <p className="line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                          {item.summary ?? ""}
                        </p>
                      </div>
                      <div className="center ml-auto shrink-0 pl-2">
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
