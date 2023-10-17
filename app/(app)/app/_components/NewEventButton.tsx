import { useModal } from "@/app/_providers/modal/provider";
import NewEventModal from "@/components/Modals/NewEvent";
import { RiAddFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";

export default function NewEventButton() {
  const modal = useModal();
  return (
    <Button
      onClick={() => modal?.show(<NewEventModal />)}
      size={"icon"}
      className="h-[50px] w-[50px]"
    >
      <RiAddFill className="h-[32px] w-[32px]" />
    </Button>
  );
}
