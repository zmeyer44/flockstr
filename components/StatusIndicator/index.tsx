import { cn } from "@/lib/utils";

const statuses = {
  offline: "text-muted-foreground/20 bg-muted",
  online: "text-green-400 bg-green-400/10",
  error: "text-rose-400 bg-rose-400/10",
  warning: "text-yellow-400 bg-yellow-400/10",
};
type StatusIndicatorProps = {
  status: keyof typeof statuses;
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div className={cn(statuses[status], "flex-none rounded-full p-1")}>
      <div className="h-2 w-2 rounded-full bg-current" />
    </div>
  );
}
