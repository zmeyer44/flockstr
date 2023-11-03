import Image from "next/image";
import { cn } from "@/lib/utils";
export default function ImageUrl({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <Image
        alt="Image"
        height="288"
        width="288"
        unoptimized
        src={url}
        className={cn(
          "h-full rounded-xl bg-background object-cover object-center max-sm:max-h-[100px]",
        )}
      />
    </div>
  );
}
