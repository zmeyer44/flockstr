import ReactPlayer from "react-player";
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
      <ReactPlayer
        url={url}
        playing={true}
        muted={false}
        controls={true}
        loop={true}
        style={{
          maxHeight: "300px",
        }}
      />
    </div>
  );
}
