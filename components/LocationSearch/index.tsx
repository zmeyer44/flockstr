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
    return <p>Loading...</p>;
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
      <PopoverContent className="z-modal+ w-auto p-0" align="start">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            disabled={!ready}
            onChangeCapture={(e) =>
              setValue((e.target as unknown as { value: string }).value)
            }
            value={value}
            placeholder="Search places..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {data.map(
                ({
                  description,
                  place_id,
                  structured_formatting: { main_text, secondary_text },
                }) => (
                  <CommandItem key={place_id}>
                    <HiOutlineBuildingStorefront className="mr-2 h-4 w-4" />
                    <span>{main_text}</span>
                    <span>{description}</span>
                  </CommandItem>
                ),
              )}
            </CommandGroup>
            {/* <CommandSeparator />
            <CommandGroup heading="Vitrual">
              <CommandItem>
                <HiOutlineBuildingStorefront className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
              <CommandItem>
                <HiOutlineBuildingStorefront className="mr-2 h-4 w-4" />
                <span>Mail</span>
              </CommandItem>
              <CommandItem>
                <HiOutlineBuildingStorefront className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup> */}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
