type LiveBadgeProps = {
  text?: string;
};
export default function LiveBadge({ text }: LiveBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative h-[14px] w-[14px]">
        <div className="absolute h-[14px] w-[14px] animate-ping rounded-full bg-primary/30"></div>
        <div className="absolute h-[14px] w-[14px] animate-pulse rounded-full bg-primary/30"></div>
        <div className="absolute left-[3px] top-[3px] h-2 w-2 rounded-full bg-primary"></div>
      </div>
      {!!text && (
        <div className="h-[14px] text-[12px] font-semibold leading-[15px] text-primary">
          {text}
        </div>
      )}
    </div>
  );
}
