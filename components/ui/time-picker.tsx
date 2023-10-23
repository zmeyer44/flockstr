"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const times = [
  { label: "12:00 AM", value: "00:00" },
  { label: "12:30 AM", value: "00:30" },
  { label: "1:00 AM", value: "01:00" },
  { label: "1:30 AM", value: "01:30" },
  { label: "2:00 AM", value: "02:00" },
  { label: "2:30 AM", value: "02:30" },
  { label: "3:00 AM", value: "03:00" },
  { label: "3:30 AM", value: "03:30" },
  { label: "4:00 AM", value: "04:00" },
  { label: "4:30 AM", value: "04:30" },
  { label: "5:00 AM", value: "05:00" },
  { label: "5:30 AM", value: "05:30" },
  { label: "6:00 AM", value: "06:00" },
  { label: "6:30 AM", value: "06:30" },
  { label: "7:00 AM", value: "07:00" },
  { label: "7:30 AM", value: "07:30" },
  { label: "8:00 AM", value: "08:00" },
  { label: "8:30 AM", value: "08:30" },
  { label: "9:00 AM", value: "09:00" },
  { label: "9:30 AM", value: "09:30" },
  { label: "10:00 AM", value: "10:00" },
  { label: "10:30 AM", value: "10:30" },
  { label: "11:00 AM", value: "11:00" },
  { label: "11:30 AM", value: "11:30" },
  { label: "12:00 PM", value: "12:00" },
  { label: "12:30 PM", value: "12:30" },
  { label: "1:00 PM", value: "13:00" },
  { label: "1:30 PM", value: "13:30" },
  { label: "2:00 PM", value: "14:00" },
  { label: "2:30 PM", value: "14:30" },
  { label: "3:00 PM", value: "15:00" },
  { label: "3:30 PM", value: "15:30" },
  { label: "4:00 PM", value: "16:00" },
  { label: "4:30 PM", value: "16:30" },
  { label: "5:00 PM", value: "17:00" },
  { label: "5:30 PM", value: "17:30" },
  { label: "6:00 PM", value: "18:00" },
  { label: "6:30 PM", value: "18:30" },
  { label: "7:00 PM", value: "19:00" },
  { label: "7:30 PM", value: "19:30" },
  { label: "8:00 PM", value: "20:00" },
  { label: "8:30 PM", value: "20:30" },
  { label: "9:00 PM", value: "21:00" },
  { label: "9:30 PM", value: "21:30" },
  { label: "10:00 PM", value: "22:00" },
  { label: "10:30 PM", value: "22:30" },
  { label: "11:00 PM", value: "23:00" },
  { label: "11:30 PM", value: "23:30" },
] as const;

type TimePickerProps = {
  value: string | undefined;
  onChange: (newTime: string) => void;
  initialFocus?: boolean;
  placeholder?: string;
  hideIcon?: boolean;
  displayFormat?: string;
  className?: string;
};
export function TimePicker({
  value,
  onChange,
  hideIcon = false,
  className,
}: TimePickerProps) {
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
          {!hideIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          <Input
            type="time"
            placeholder="HH:MM"
            value={value}
            onChange={(e) => {
              console.log(e.target.valueAsNumber);
              onChange(e.target.value);
            }}
            className={cn(
              "border-0 shadow-none outline-none ring-0 focus-visible:ring-0",
              className,
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-modal+  w-auto p-0" align="start">
        <Command className="max-h-[200px]">
          <CommandGroup className="overflow-y-auto">
            {times.map((time) => (
              <CommandItem
                value={time.label}
                key={time.value}
                onSelect={() => {
                  onChange(time.value);
                }}
              >
                {time.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
