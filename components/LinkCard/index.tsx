"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchMetadata } from "@/lib/fetchers/metadata";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type LinkCardProps = {
  url: string;
  metadata?: {
    title: string;
    image?: string;
    description?: string;
    creator?: string;
    type?: string;
    "theme-color"?: string;
  };
  className?: string;
};
export default function LinkCard({
  url,
  metadata: _metadata,
  className,
}: LinkCardProps) {
  const [metadata, setMetadata] = useState(_metadata);
  useEffect(() => {
    if (!metadata) {
      fetchMetadata(url)
        ?.then((r) => {
          if (r) {
            setMetadata(r.data);
          }
        })
        .catch((e) => console.log("fetch error"));
    }
  }, [url]);
  if (metadata) {
    return (
      <a href={url} target="_blank" rel="nonreferrer" className="w-full">
        <Card className={cn("group", className)}>
          {metadata.image && (
            <div className="max-h-[100px] overflow-hidden rounded-t-md">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                  width={250}
                  height={100}
                  src={metadata.image}
                  alt={metadata.title}
                  unoptimized
                  className={cn(
                    "aspect-video w-auto object-cover object-center align-middle transition-all group-hover:scale-105",
                  )}
                />
              </AspectRatio>
            </div>
          )}
          <div className="">
            <CardHeader className="space-y-0 p-2">
              <CardTitle className="line-clamp-1 text-sm font-medium group-hover:underline">
                {metadata.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-[10px]">
                {metadata.description}
              </CardDescription>
            </CardHeader>
          </div>
        </Card>
      </a>
    );
  }
  return null;
}
