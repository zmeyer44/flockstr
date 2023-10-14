import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HiOutlineCheckBadge } from "react-icons/hi2";

type SubscriptionCardProps = {
  id: string;
  title: string;
  picture: string;
  description: string;
  tags: string[];
};
export default function SubscriptionCard({
  picture,
  title,
  tags,
  description,
}: SubscriptionCardProps) {
  return (
    <Card className="group sm:flex">
      <div className="overflow-hidden max-sm:h-[100px] max-sm:rounded-t-md sm:w-[250px] sm:rounded-l-md">
        <Image
          width={250}
          height={150}
          src={picture}
          alt={title}
          unoptimized
          className={cn(
            "w-auto object-cover object-center transition-all group-hover:scale-105 sm:h-full",
          )}
        />
      </div>
      <div className="">
        <CardHeader className="">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="items-strech flex w-full flex-col items-center gap-2 sm:max-w-md sm:flex-row sm:gap-4">
          <Button className="w-full">Buy now</Button>
          <Button variant={"secondary"} className="w-full">
            Details
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
