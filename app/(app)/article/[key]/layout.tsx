import { ReactElement, ReactNode } from "react";
import { nip19 } from "nostr-tools";
import { redirect } from "next/navigation";
export default function ModalLayout(props: {
  children: ReactElement;
  "1": ReactNode;
  "30023": ReactNode;
  "30311": ReactNode;
  event: ReactNode;
  params: {
    key: string;
  };
}) {
  const key = props.params.key;
  const { data, type } = nip19.decode(key);
  if (type === "naddr") {
    const kind = data.kind;
    if (kind === 30023) {
      return (
        <div className="z-overlay fixed inset-y-[10px] left-[10px] right-[10px] overflow-hidden overflow-y-auto rounded-lg border bg-background px-4 sm:left-[calc(10px_+_var(--sidebar-closed-width))] xl:left-[calc(10px_+_var(--sidebar-open-width))]">
          {props[30023]}
        </div>
      );
    } else if (kind === 30311) {
      return (
        <div className="z-overlay fixed inset-y-[10px] left-[10px] right-[10px] overflow-hidden overflow-y-auto rounded-lg border bg-background px-4 sm:left-[calc(10px_+_var(--sidebar-closed-width))] xl:left-[calc(10px_+_var(--sidebar-open-width))]">
          {props[30311]}
        </div>
      );
    }
  } else if (type === "note") {
    return (
      <div className="z-overlay fixed inset-y-[10px] left-[10px] right-[10px] overflow-hidden overflow-y-auto rounded-lg border bg-background px-4 sm:left-[calc(10px_+_var(--sidebar-closed-width))] xl:left-[calc(10px_+_var(--sidebar-open-width))]">
        {props[1]}
      </div>
    );
  } else if (type === "nevent") {
    return (
      <div className="z-overlay fixed inset-y-[10px] left-[10px] right-[10px] overflow-hidden overflow-y-auto rounded-lg border bg-background px-4 sm:left-[calc(10px_+_var(--sidebar-closed-width))] xl:left-[calc(10px_+_var(--sidebar-open-width))]">
        {props.event}
      </div>
    );
  } else if (type === "npub") {
    return redirect(`/${key}`);
  }
  return redirect(`/app`);
}
