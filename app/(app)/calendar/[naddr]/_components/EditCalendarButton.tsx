import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import RSVPModal from "@/components/Modals/RSVP";

type RSVPButtonProps = {
  eventReference: string;
};

export default function RSVPButton({ eventReference }: RSVPButtonProps) {
  const modal = useModal();

  return (
    <Button
      variant={"outline"}
      onClick={() => modal?.show(<RSVPModal eventReference={eventReference} />)}
    >
      Edit
    </Button>
  );
}
