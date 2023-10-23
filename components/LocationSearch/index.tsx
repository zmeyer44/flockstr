"use client";
import { useMemo, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlineHomeModern,
  HiOutlineFilm,
  HiOutlineShoppingBag,
  HiOutlineBuildingLibrary,
} from "react-icons/hi2";
import { RxMagnifyingGlass } from "react-icons/rx";
import { LiaGlassMartiniSolid } from "react-icons/lia";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLoadScript } from "@react-google-maps/api";
import Spinner from "../spinner";

type LocationSearchInputProps = {
  onSelect: (location: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
};
export default function LocationSearchInput({
  onSelect,
  location,
}: LocationSearchInputProps) {
  console.log("LOCATION", location);
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  if (loadError) {
    return <p>{JSON.stringify(loadError)}</p>;
  }
  if (!isLoaded) {
    return (
      <Button
        variant={"ghost"}
        disabled={true}
        className={cn(
          "justify-start p-0 text-left font-normal",
          "text-muted-foreground",
        )}
      >
        Add a location...
      </Button>
    );
  }
  return <CommandSearch location={location} onSelect={onSelect} />;
}

type CommandSearchProps = {
  onSelect: (location: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
};
function CommandSearch({ location, onSelect }: CommandSearchProps) {
  const [open, setOpen] = useState(false);
  const {
    ready,
    value,
    suggestions: { status, data, loading }, // results from Google Places API for the given search term
    setValue, // use this method to link input value with the autocomplete hook
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
    cache: 86400,
  });
  async function handleSelect(placeId: string, name: string) {
    const result = await getGeocode({
      placeId,
    });
    if (!result[0]) return;
    const coordinates = getLatLng(result[0]);
    setOpen(false);
    return onSelect({
      name,
      coordinates,
      address: result[0].formatted_address,
    });
  }
  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant={"ghost"}
          className={cn(
            "w-full justify-start p-0 pl-2 text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {location ? (
            <div className="flex max-w-full items-baseline gap-x-2">
              {location.name}
              <span className="truncate text-xs text-muted-foreground">
                {location.address}
              </span>
            </div>
          ) : (
            "Add a location..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-modal+ w-[280px] max-w-[300px] p-0"
        align="start"
      >
        <div className="rounded-lg border shadow-md">
          <div className="relative flex">
            <Input
              className="border-0 pl-[30px] shadow-none outline-none focus-visible:ring-0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search places..."
              disabled={!ready}
            />
            <div className="center absolute inset-y-0 left-[8px]">
              <RxMagnifyingGlass className="h-4 w-4" />
            </div>
          </div>
          <ul className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden")}>
            {data.map((place) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
                types,
              } = place;
              return (
                <li
                  key={place_id}
                  onClick={() => handleSelect(place_id, main_text)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm  px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted",
                  )}
                >
                  <RenderIcon types={types} className="mr-2 h-4 w-4" />
                  <div className="flex-1 space-y-0.5">
                    <p className="line-clamp-1">{main_text}</p>
                    <span className=" line-clamp-1 text-[10px] leading-none text-muted-foreground">
                      {secondary_text}
                    </span>
                  </div>
                </li>
              );
            })}
            {data.length === 0 && status === "ZERO_RESULTS" && (
              <div className="p-3 text-center">
                <p>No results found</p>
              </div>
            )}
            {loading && (
              <div className="center p-3 text-primary">
                <Spinner />
              </div>
            )}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function RenderIcon({
  types,
  className,
}: {
  types: string[];
  className?: string;
}) {
  if (types.includes("restaurant")) {
    return <HiOutlineBuildingStorefront className={className} />;
  } else if (types.includes("art_gallery")) {
    return <HiOutlineHomeModern className={className} />;
  } else if (types.includes("bar")) {
    return <LiaGlassMartiniSolid className={className} />;
  } else if (types.includes("city_hall")) {
    return <HiOutlineBuildingLibrary className={className} />;
  } else if (types.includes("store")) {
    return <HiOutlineShoppingBag className={className} />;
  } else if (types.includes("movie_theater")) {
    return <HiOutlineFilm className={className} />;
  }
  return <HiOutlineMapPin className={className} />;
}
