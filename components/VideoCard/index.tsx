import Image from "next/image";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { RxClock } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/dates";

type VideoCardProps = {
  card: {
    image: string;
    title: string;
    tags: string[];
    starts?: number;
    status: "live" | "planned" | "ended";
    ["total_participants"]?: number;
  };
  className?: string;
};

export default function VideoCard({ className, card }: VideoCardProps) {
  const startTime = card?.starts ? new Date(card.starts * 1000) : null;
  return (
    <div
      className={cn(
        "group flex h-full flex-col space-y-3 rounded-[16px] p-2 hover:bg-muted",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-md">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={card.image}
            alt={card.title}
            width={250}
            height={150}
            unoptimized
            className={cn(
              "h-auto w-auto object-cover transition-all group-hover:scale-105",
              "aspect-video",
            )}
          />
        </AspectRatio>
        {card.status === "live" && (
          <div className="pointer-events-none absolute bottom-0 right-0 p-2">
            <Badge variant={"red"}>LIVE</Badge>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2 text-base">
        <h3 className="line-clamp-2 font-medium leading-none">{card.title}</h3>
        <div className="flex items-center gap-x-3">
          <div className="flex flex-col items-start">
            {startTime && (
              <div className="center gap-x-1 text-xs text-muted-foreground">
                <RxClock className="h-4 w-4 text-primary" />
                <span>{formatDate(new Date(startTime), "h:m a")}</span>
              </div>
            )}
            {card["total_participants"] && (
              <div className="center gap-x-1 text-xs text-muted-foreground">
                <HiOutlineUsers className="h-4 w-4 text-primary" />
                <span>{formatNumber(card["total_participants"])}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="-mt-1 flex flex-wrap-reverse gap-2 overflow-x-hidden">
        {card.tags.slice(0, 4).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
export function VideoCardLoading({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "group pointer-events-none flex flex-col space-y-3 rounded-[16px] p-2",
        className,
      )}
    >
      <div className="overflow-hidden rounded-md">
        <AspectRatio ratio={16 / 9} className="bg-muted"></AspectRatio>
      </div>
      <div className="flex-1 space-y-2 text-base">
        <Skeleton className="mb-2 h-4 w-1/3 bg-muted" />
        <div className="flex flex-col items-start">
          <div className="center gap-x-1 text-xs text-muted-foreground">
            <RxClock className="h-4 w-4 text-primary" />
            <Skeleton className="h-3 w-[50px] bg-muted" />
          </div>
        </div>
      </div>
      <div className="-mt-1 flex flex-wrap gap-2 overflow-x-hidden">
        <Skeleton className="h-2 w-[50px] bg-muted" />
        <Skeleton className="h-2 w-[40px] bg-muted" />
        <Skeleton className="h-2 w-[30px] bg-muted" />
      </div>
    </div>
  );
}
