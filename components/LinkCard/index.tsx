"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fetchMetadata } from "@/lib/fetchers/metadata";
import { HiOutlineCheckBadge } from "react-icons/hi2";

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
      <a href={url} target="_blank" rel="nonreferrer">
        <Card className="group">
          {metadata.image && (
            <div className="h-[150px] overflow-hidden rounded-t-md">
              <Image
                width={250}
                height={150}
                src={metadata.image}
                alt={metadata.title}
                unoptimized
                className={cn(
                  "w-auto object-cover object-center transition-all group-hover:scale-105",
                )}
              />
            </div>
          )}
          <div className="">
            <CardHeader className="">
              <CardTitle className="line-clamp-2">{metadata.title}</CardTitle>
              <CardDescription className="line-clamp-3">
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
