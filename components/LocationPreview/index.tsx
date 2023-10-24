"use client";

import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Geohash from "latlon-geohash";
import { HiMapPin } from "react-icons/hi2";

type LocationPreviewProps = {
  geohash: string;
  address: string;
  className?: string;
};
export default function LocationPreview({
  geohash,
  address,
  className,
}: LocationPreviewProps) {
  const libraries = useMemo(() => ["places"], []);
  const { lat, lon } = Geohash.decode(geohash);
  const mapCenter = useMemo(() => ({ lat, lng: lon }), []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    [],
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return (
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-3">
          <HiMapPin className="h-5 w-5" />
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="h-[150px] p-0">
          <div className="h-full w-full bg-muted"></div>
        </CardContent>
        <CardFooter className="p-3 text-sm text-muted-foreground">
          {address}
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-3">
        <HiMapPin className="h-5 w-5" />
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="h-[150px] p-0">
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={() => console.log("Map Component Loaded...")}
        />
      </CardContent>
      <CardFooter className="p-3 text-sm text-muted-foreground">
        {address}
      </CardFooter>
    </Card>
  );
}
