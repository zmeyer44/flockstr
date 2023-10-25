"use client";
import { HiSignal } from "react-icons/hi2";
import { RiAddFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import Feed from "@/containers/Feed";
import CreateKind1Modal from "@/components/Modals/Kind1";

import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useModal } from "@/app/_providers/modal/provider";

type AnnouncementsContainerProps = {
  eventReference: string;
  hosts: string[];
};
export default function AnnouncementsContainer({
  eventReference,
  hosts,
}: AnnouncementsContainerProps) {
  const modal = useModal();

  const { currentUser } = useCurrentUser();
  return (
    <div className="overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem]">
      <div className="flex items-center justify-between gap-x-3 pb-2 pl-2">
        <div className="flex items-center gap-x-3">
          <HiSignal className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Announcements</h3>
        </div>
        {currentUser && hosts.includes(currentUser.pubkey) && (
          <Button
            onClick={() =>
              modal?.show(
                <CreateKind1Modal
                  tags={[
                    ["a", eventReference],
                    ["l", "announcement"],
                  ]}
                />,
              )
            }
            size={"icon"}
            className="center group h-auto w-auto gap-x-1 rounded-full p-1"
          >
            <RiAddFill className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="w-full space-y-3">
        <Feed
          filter={{
            authors: hosts,
            ["#a"]: [eventReference],
            ["#l"]: ["announcement"],
          }}
          empty={() => (
            <div className="py-3 text-center text-sm text-muted-foreground">
              <p>No Announcements yet</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
