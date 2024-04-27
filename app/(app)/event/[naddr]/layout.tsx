import type { Metadata, ResolvingMetadata } from "next";
import { getEvent } from "@/lib/server-actions/meta/event";
import { nip19 } from "nostr-tools";
import { getTagValues } from "@/lib/nostr/utils";

export async function generateMetadata(
  { params }: { params: { naddr: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];
  // read route params
  const identifier = params.naddr;
  const { data, type } = nip19.decode(identifier);
  if (type !== "naddr") {
    return {
      title: "Flockstr Event",
      openGraph: {
        images: previousImages,
      },
    };
  }

  // fetch data
  const event = await getEvent(data.kind, data.pubkey, data.identifier);

  // optionally access and extend (rather than replace) parent metadata
  if (!event) {
    return {
      title: "Flockstr Event",
      openGraph: {
        images: previousImages,
      },
    };
  }

  const title = `${getTagValues("title", event.tags as string[][])} | Flockstr`;
  const images =
    getTagValues("image", event.tags as string[][]) ??
    getTagValues("banner", event.tags as string[][]) ??
    "";

  return {
    title: title,
    description: event.content,
    openGraph: {
      title: title,
      description: event.content,
      images: [images],
    },
    twitter: {
      title: title,
      description: event.content,
      images: [images],
      card: "summary_large_image",
    },
  };
}

export default function metadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
