"use client";
import { useModal } from "@/app/_providers/modal/provider";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import NewEventModal from "@/components/Modals/NewEvent";
import { RiAddFill } from "react-icons/ri";
import LoginModal from "@/components/Modals/Login";
import { Button } from "@/components/ui/button";

export default function NewEventButton() {
  const modal = useModal();
  const { currentUser } = useCurrentUser();

  return (
    <Button
      onClick={() => {
        if (currentUser) {
          return modal?.show(<NewEventModal />);
        } else {
          return modal?.show(<LoginModal />);
        }
      }}
      size={"icon"}
      className="h-[50px] w-[50px]"
    >
      <RiAddFill className="h-[32px] w-[32px]" />
    </Button>
  );
}
