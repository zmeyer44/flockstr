import { HiOutlineUserGroup } from "react-icons/hi2";
import AvatarStack from "@/components/ProfileContainers/AvatarStack";

import UserRow from "./UserRow";
type AttendeesContainerProps = {
  attendees: string[];
};
export default function AttendeesContainer({
  attendees,
}: AttendeesContainerProps) {
  return (
    <div className="overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem]">
      <div className="flex items-center gap-x-3 px-2 pb-2">
        <HiOutlineUserGroup className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Attendees</h3>
      </div>
      <AvatarStack pubkeys={attendees} />
    </div>
  );
}
