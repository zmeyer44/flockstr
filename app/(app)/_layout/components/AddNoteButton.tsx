"use client";

import { useModal } from "@/app/_providers/modal/provider";
import { Button } from "@/components/ui/button";
import { RiAddFill } from "react-icons/ri";
import NewEventModal from "@/components/Modals/NewEvent";
import LoginModal from "@/components/Modals/Login";
import useCurrentUser from "@/lib/hooks/useCurrentUser";

export default function AddNoteButton() {
  const modal = useModal();
  const { currentUser } = useCurrentUser();
  return (
    <>
      <Button
        onClick={() => {
          if (currentUser) {
            return modal?.show(<NewEventModal />);
          } else {
            return modal?.show(<LoginModal />);
          }
        }}
        size={"icon"}
        className="xl:hidden"
      >
        <RiAddFill className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => {
          if (currentUser) {
            return modal?.show(<NewEventModal />);
          } else {
            return modal?.show(<LoginModal />);
          }
        }}
        size={"lg"}
        className="hidden xl:flex"
      >
        <div className="center gap-x-1.5">
          <RiAddFill className="h-6 w-6" />
          <span>Add Note</span>
        </div>
      </Button>
    </>
  );
}
