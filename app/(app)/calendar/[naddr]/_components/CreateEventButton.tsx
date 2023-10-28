import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import CreateCalendarEventModal from "@/components/Modals/CreateCalendarEvent";

type CreateEventButtonProps = {
  eventReference: string;
};

export default function CreateEventButton({
  eventReference,
}: CreateEventButtonProps) {
  const modal = useModal();

  return (
    <Button onClick={() => modal?.show(<CreateCalendarEventModal />)}>
      Create Event
    </Button>
  );
}
