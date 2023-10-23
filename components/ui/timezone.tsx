"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiOutlineGlobeAlt, HiChevronDown, HiCheck } from "react-icons/hi2";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TIMEZONES } from "@/constants/timezones";
const timezones = TIMEZONES.filter((t) =>
  Intl.supportedValuesOf("timeZone").includes(t.name),
).map((t) => ({
  label: `(${t.offset}) ${t.name.split("/").pop()?.replaceAll("_", " ")}`,
  value: t.name,
}));

type TimezoneSelectorProps = {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  hideIcon?: boolean;
};
export function TimezoneSelector({
  value,
  onChange,
  className,
  hideIcon = false,
}: TimezoneSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn("flex items-center gap-2", className)}
        >
          {!hideIcon && <HiOutlineGlobeAlt className="h-4 w-4 shrink-0" />}
          <span className="shrink truncate">
            {value
              ? timezones.find((timezone) => timezone.value === value)?.label
              : "Select timezone..."}
          </span>
          {!hideIcon && (
            <HiChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-modal+ w-[250px] p-0">
        <Command className="max-h-[200px]">
          <CommandInput placeholder="Search timezone..." className="h-9" />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            {timezones.map((timezone) => (
              <CommandItem
                key={timezone.value}
                value={timezone.value}
                onSelect={() => {
                  onChange(timezone.value);
                  setOpen(false);
                }}
              >
                {timezone.label}
                <HiCheck
                  className={cn(
                    "ml-auto h-4 w-4 text-primary",
                    value === timezone.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
