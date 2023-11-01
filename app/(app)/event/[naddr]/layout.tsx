import type { Metadata, ResolvingMetadata } from "next";
import { get } from "@/lib/server-actions/events/cache";

export async function generateMetadata(
  { params }: { params: { naddr: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const identifier = params.naddr;

  // fetch data
  const event = await get(identifier);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  if (!event) {
    return {
      title: "Flockstr Event",
      openGraph: {
        images: previousImages,
      },
    };
  }
  const title = `${event.name} | Flockstr`;
  return {
    title: title,
    description: event.description,
    openGraph: {
      title: title,
      description: event.description,
      images: [event.image, ...previousImages],
    },
    twitter: {
      title: title,
      description: event.description,
      images: [event.image],
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
