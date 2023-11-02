import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import CreateCalendarEventModal from "@/components/Modals/CreateCalendarEvent";

type CreateEventButtonProps = {
  eventIdentifier: string;
};

export default function CreateEventButton({
  eventIdentifier,
}: CreateEventButtonProps) {
  const modal = useModal();

  return (
    <Button
      onClick={() =>
        modal?.show(<CreateCalendarEventModal calendar={eventIdentifier} />)
      }
    >
      Create Event
    </Button>
  );
}
