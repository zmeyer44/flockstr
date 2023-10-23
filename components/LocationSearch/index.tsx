"use client";
import { useMemo } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useLoadScript } from "@react-google-maps/api";

export default function LocationSearchInput() {
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });
  const {
    ready,
    value,
    suggestions: { status, data }, // results from Google Places API for the given search term
    setValue, // use this method to link input value with the autocomplete hook
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } }, // restrict search to US
    debounce: 300,
    cache: 86400,
  });
  if (loadError) {
    return <p>hello{JSON.stringify(loadError)}</p>;
  }
  if (!isLoaded) {
    return (
      <Button
        variant={"ghost"}
        disabled={true}
        className={cn(
          "justify-start p-0 text-left font-normal",
          !value && "text-muted-foreground",
        )}
      >
        Add a location...
      </Button>
    );
  }
  return <CommandSearch />;
}
function CommandSearch() {
  const {
    ready,
    value,
    suggestions: { status, data }, // results from Google Places API for the given search term
    setValue, // use this method to link input value with the autocomplete hook
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } }, // restrict search to US
    debounce: 300,
    cache: 86400,
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "justify-start p-0 text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          Add a location...
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-modal+ w-auto max-w-[300px] p-0"
        align="start"
      >
        <div className="rounded-lg border shadow-md">
          <Input
            className="border-0 shadow-none focus-visible:ring-0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search places..."
            disabled={!ready}
          />
          <ul className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden")}>
            {data.map((place) => {
              const {
                description,
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = place;
              return (
                <li
                  key={place_id}
                  onClick={() => console.log(place)}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted",
                  )}
                >
                  <HiOutlineBuildingStorefront className="mr-2 h-4 w-4" />
                  <div className="line-clamp-1">
                    <p>{main_text}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {secondary_text}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
