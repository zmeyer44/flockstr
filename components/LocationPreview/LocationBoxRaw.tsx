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
export default function LocationBoxRaw({
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
    return <div className="h-full w-full bg-muted"></div>;
  }
  return (
    <GoogleMap
      options={mapOptions}
      zoom={14}
      center={mapCenter}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      onLoad={() => console.log("Map Component Loaded...")}
    />
  );
}
