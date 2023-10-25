import { HiSignal } from "react-icons/hi2";
import Feed from "@/containers/Feed";

type AnnouncementsContainerProps = {
  eventReference: string;
};
export default function AnnouncementsContainer({
  eventReference,
}: AnnouncementsContainerProps) {
  return (
    <div className="overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem]">
      <div className="flex items-center gap-x-3 px-2 pb-2">
        <HiSignal className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Announcements</h3>
      </div>
      <div className="w-full space-y-3">
        <Feed
          filter={{
            kinds: [1],
            ["#a"]: [eventReference],
          }}
          empty={() => (
            <div className="py-5 text-center text-muted-foreground">
              <p>No Announcements yet</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
