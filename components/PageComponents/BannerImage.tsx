"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BannerImage({ image }: { image: string }) {
  const [portrait, setPortrait] = useState(false);
  return (
    <>
      <Image
        className="absolute inset-0 h-full w-full scale-125 object-cover align-middle blur-lg"
        src={image}
        width={400}
        height={100}
        alt="banner"
        unoptimized
      />
      <div className="absolute inset-0 bg-zinc-800/50"></div>
      <Image
        priority
        className={cn(
          "absolute h-full  object-cover align-middle",
          portrait
            ? "inset-y-0 left-1/2 mx-auto w-auto -translate-x-1/2"
            : "inset-0 w-full",
        )}
        src={image}
        width={400}
        height={100}
        alt="banner"
        unoptimized
      />
      <Image
        alt="demo"
        className="absolute bottom-full right-full h-auto w-auto"
        width={1}
        height={1}
        src={image}
        onLoad={(e) => {
          console.log(
            "Width",
            e.currentTarget.width,
            "Height",
            e.currentTarget.height,
          );
          if (e.currentTarget.width < e.currentTarget.height) {
            setPortrait(true);
          }
        }}
      />
    </>
  );
}
