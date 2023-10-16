import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { RxClock } from "react-icons/rx";
import { AspectRatio } from "@/components/ui/aspect-ratio";
type VideoCardProps = {
  card: {
    picture: string;
    title: string;
    tags: string[];
  };
  className?: string;
};

export default function VideoCard({ className, card }: VideoCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col space-y-3 rounded-[16px] p-2 hover:bg-muted",
        className,
      )}
    >
      <div className="overflow-hidden rounded-md">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={card.picture}
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
      </div>
      <div className="flex-1 space-y-2 text-base">
        <h3 className="line-clamp-2 font-medium leading-none">{card.title}</h3>
        <div className="flex flex-col items-start">
          <div className="center gap-x-1 text-xs text-muted-foreground">
            <RxClock className="h-4 w-4 text-primary" />
            <span>12:00 PM</span>
          </div>
        </div>
      </div>
      <div className="-mt-1 flex flex-wrap gap-2 overflow-x-hidden">
        {card.tags.slice(0, 4).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
