import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";

export default function Kind3745({}: Event) {
  return (
    <Container>
      <CardTitle className="mb-1.5 line-clamp-2 text-lg font-semibold">
        The start of the Nostr revolution
      </CardTitle>
      <CardDescription className="line-clamp-4 text-sm">
        This is the summary of this artilce. Let's hope that it is a good
        article and that it will end up being worth reading. I don't want to
        waste my time on some random other stuff.
      </CardDescription>
    </Container>
  );
}
