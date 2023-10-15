import Container from "./components/Container";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { type Event } from "nostr-tools";
import { RenderText } from "../TextRendering";
import { getTagsValues } from "@/lib/nostr/utils";
import LinkCard from "@/components/LinkCard";
export default function Kind1({ content, tags }: Event) {
  const r = getTagsValues("r", tags);
  return (
    <Container>
      <CardDescription className="text-base text-foreground">
        <RenderText text={content} />
      </CardDescription>
      {!!r.length && (
        <div className="mt-1.5 flex flex-wrap">
          {r.map((url) => (
            <LinkCard key={url} url={url} className="max-w-[250px]" />
          ))}
        </div>
      )}
    </Container>
  );
}
