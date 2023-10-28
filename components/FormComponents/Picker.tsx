"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HiChevronDown, HiCheck } from "react-icons/hi2";
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

type PickerProps<T> = {
  options: T[];
  value: string | undefined;
  noun: string;
  placeholder: string;
  onChange: (val: T) => void;
  className?: string;
  pre?: React.ReactNode;
};
export default function Picker<T extends { label: string; value: string }>({
  value,
  onChange,
  options,
  noun,
  placeholder,
  className,
  pre,
}: PickerProps<T>) {
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
          {pre}
          <span className="shrink truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>

          <HiChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-modal+ w-[250px] p-0">
        <Command className="max-h-[200px]">
          <CommandInput placeholder={`Search ${noun}...`} className="h-9" />
          <CommandEmpty>{`No ${noun} Found.`}</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option.label}
                <HiCheck
                  className={cn(
                    "ml-auto h-4 w-4 text-primary",
                    value === option.value ? "opacity-100" : "opacity-0",
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
