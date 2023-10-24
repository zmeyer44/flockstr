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

type LocationPreviewProps = {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  className?: string;
};
export default function LocationPreview({
  coordinates,
  address,
  className,
}: LocationPreviewProps) {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => coordinates, []);

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
    return <p>Loading...</p>;
  }
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "200px", height: "200px" }}
          onLoad={() => console.log("Map Component Loaded...")}
        />
        <CardFooter>{address}</CardFooter>
      </CardContent>
    </Card>
  );
}
