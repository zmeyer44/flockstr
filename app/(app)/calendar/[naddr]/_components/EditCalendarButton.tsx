import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import EditCalendarModal from "@/components/Modals/EditCalendar";
import { NostrEvent } from "@nostr-dev-kit/ndk";

type RSVPButtonProps = {
  event: NostrEvent;
};

export default function RSVPButton({ event }: RSVPButtonProps) {
  const modal = useModal();

  return (
    <Button
      variant={"outline"}
      onClick={() => modal?.show(<EditCalendarModal listEvent={event} />)}
    >
      Edit
    </Button>
  );
}
