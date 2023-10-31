import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import EditEventModal from "@/components/Modals/EditEvent";
import { NostrEvent } from "@nostr-dev-kit/ndk";

type EditEventProps = {
  event: NostrEvent;
};

export default function EditEvent({ event }: EditEventProps) {
  const modal = useModal();

  return (
    <Button
      variant={"outline"}
      onClick={() => modal?.show(<EditEventModal listEvent={event} />)}
    >
      Edit
    </Button>
  );
}
