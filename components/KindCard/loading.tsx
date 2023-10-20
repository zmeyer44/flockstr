import Container from "./components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { type KindCardProps } from "./";

export default function KindLoading() {
  return (
    <Container>
      <div className="mb-3 space-y-2 text-muted-foreground">
        <Skeleton className="mb-2 h-4 w-1/3 bg-muted" />
        <Skeleton className="h-4 w-1/2 bg-muted" />
        <Skeleton className="h-4 w-2/5 bg-muted" />
        <Skeleton className="h-4 w-4/5 bg-muted" />
      </div>
    </Container>
  );
}
