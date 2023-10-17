import { redirect } from "next/navigation";
import { nip19 } from "nostr-tools";

export default function Layout(props: {
  children: React.ReactNode;
  params: {
    npub?: string;
  };
}) {
  const key = props.params.npub;
  if (key === "service-worker.js") {
    redirect("/");
  }
  return props.children;
}
