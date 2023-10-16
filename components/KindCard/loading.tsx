import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { Skeleton } from "@/components/ui/skeleton";

export default function KindLoading() {
  return (
    <Container
      pubkey={
        "f7234bd4c1394dda46d09f35bd384dd30cc552ad5541990f98844fb06676e9ca"
      }
    >
      <div className="space-y-2 text-muted-foreground">
        <Skeleton className="mb-2 h-4 w-1/3 bg-muted" />
        <Skeleton className="h-4 w-1/2 bg-muted" />
        <Skeleton className="h-4 w-2/5 bg-muted" />
        <Skeleton className="h-4 w-4/5 bg-muted" />
      </div>
    </Container>
  );
}
