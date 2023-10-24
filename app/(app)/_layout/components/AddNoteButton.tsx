import { useModal } from "@/app/_providers/modal/provider";
import { Button } from "@/components/ui/button";
import { RiAddFill } from "react-icons/ri";
import NewEventModal from "@/components/Modals/NewEvent";

export default function AddNoteButton() {
  const modal = useModal();
  return (
    <>
      <Button
        onClick={() => modal?.show(<NewEventModal />)}
        size={"icon"}
        className="xl:hidden"
      >
        <RiAddFill className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => modal?.show(<NewEventModal />)}
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
