import { useState } from "react";

import { Button } from "@/components/ui/button";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiRepeatFill } from "react-icons/ri";

import RSVPModal from "@/components/Modals/RSVP";
import ConfirmModal from "@/components/Modals/Confirm";

import { NDKKind, type NDKEvent } from "@nostr-dev-kit/ndk";
import { getTagAllValues, getTagValues } from "@/lib/nostr/utils";
import { formatDate } from "@/lib/utils/dates";

import { useModal } from "@/app/_providers/modal/provider";
import { btcToSats, formatNumber } from "@/lib/utils";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useNDK } from "@/app/_providers/ndk";
import { toast } from "sonner";

import { sendZap, checkPayment } from "@/lib/actions/zap";
import { useEvent } from "@/lib/hooks/useEvents";

type RSVPButtonProps = {
  event: NDKEvent;
};

export default function RSVPButton({ event }: RSVPButtonProps) {
  const modal = useModal();
  const { currentUser } = useCurrentUser();
  const { ndk } = useNDK();
  const eventReference = event.tagId();
  const name = getTagValues("name", event.tags);
  const tickets = getTagValues("tickets", event.tags);
  const price = getTagAllValues("price", event.tags);
  const priceInBTC = parseFloat(getTagValues("price", event.tags) ?? "0");
  const [ticketPending, setTicketPending] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const { event: rsvpEvent } = useEvent({
    filter: {
      kinds: [31925 as NDKKind],
      authors: [currentUser?.pubkey as string],
      ["#a"]: [eventReference],
    },
    enabled: !!currentUser,
  });

  async function handleBuyTicket() {
    setTicketPending(true);
    try {
      if (!currentUser || !ndk?.signer) return;

      const result = await sendZap(
        ndk!,
        btcToSats(priceInBTC),
        event.rawEvent(),
        `Ticket payment: ${name}`,
      );
      toast.success("Payment Sent!");
      void handleCheckPayment();
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setTicketPending(false);
    }
  }

  async function handleCheckPayment() {
    if (!event || !currentUser || !ndk) return;
    setCheckingPayment(true);
    try {
      const result = await checkPayment(
        ndk,
        event.tagId(),
        currentUser.pubkey,
        event.rawEvent(),
      );
      console.log("Payment result", result);
      if (result) {
        setHasValidPayment(true);
      }
    } catch (err) {
      console.log("error sending zap", err);
    } finally {
      setCheckingPayment(false);
    }
  }

  if (!tickets) {
    if (rsvpEvent) {
      const rsvpResponse = getTagValues("l", rsvpEvent.tags);
      return (
        <div className="flex items-center">
          <Button disabled>
            {rsvpResponse === "accepted"
              ? "Going"
              : rsvpResponse === "tentative"
              ? "Tentative"
              : "Not Going"}
          </Button>
          <Button
            onClick={() =>
              modal?.show(<RSVPModal eventReference={eventReference} />)
            }
            variant={"secondary"}
            size="icon"
          >
            <RiRepeatFill className="h-5 w-5" />
          </Button>
        </div>
      );
    } else {
      return (
        <Button
          onClick={() =>
            modal?.show(<RSVPModal eventReference={eventReference} />)
          }
        >
          RSVP
        </Button>
      );
    }
  }
  if (price) {
    return (
      <Button
        onClick={() =>
          modal?.show(
            <ConfirmModal
              title={`Buy Ticket for ${name}`}
              onConfirm={handleBuyTicket}
              ctaBody={
                <>
                  <span>Zap for Ticket</span>
                  <HiOutlineLightningBolt className="h-4 w-4" />
                </>
              }
            >
              <p className="text-muted-forground">
                {`Pay ${priceInBTC} BTC (${formatNumber(
                  btcToSats(priceInBTC),
                )} sats) for one ticket for ${name}`}
              </p>
            </ConfirmModal>,
          )
        }
      >
        Buy Ticket
      </Button>
    );
  }
  return (
    <Button
      onClick={() =>
        modal?.show(
          <ConfirmModal
            title={`Get Ticket for ${name}`}
            onConfirm={handleBuyTicket}
            ctaBody={
              <>
                <span>Zap to Subscribe</span>
                <HiOutlineLightningBolt className="h-4 w-4" />
              </>
            }
          >
            <p className="text-muted-forground">
              {`Pay ${priceInBTC} BTC (${formatNumber(
                btcToSats(priceInBTC),
              )} sats) for year long access until ${formatDate(
                new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                "MMM Do, YYYY",
              )}`}
            </p>
          </ConfirmModal>,
        )
      }
    >
      Get Ticket
    </Button>
  );
}
