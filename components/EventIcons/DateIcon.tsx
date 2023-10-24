import { formatDate } from "@/lib/utils/dates";

type SmallCalendarIconProps = {
  date: Date;
};
export default function SmallCalendarIcon({ date }: SmallCalendarIconProps) {
  return (
    <div className="center h-10 w-10 overflow-hidden rounded-sm border bg-background text-muted-foreground">
      <div className="w-full text-center">
        <div className="bg-muted p-[2px] text-[10px] font-semibold uppercase">
          {formatDate(date, "MMM")}
        </div>
        <div className="text-center text-[14px] font-medium">
          {formatDate(date, "D")}
        </div>
      </div>
    </div>
  );
}
