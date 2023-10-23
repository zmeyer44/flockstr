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

type DatePickerProps = {
  date: Date | undefined;
  onDateChange: (newDate: Date | undefined) => void;
  initialFocus?: boolean;
  placeholder?: string;
  hideIcon?: boolean;
  displayFormat?: string;
};

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  initialFocus,
  hideIcon = false,
  displayFormat,
}: DatePickerProps) {
  //   const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-end pr-1 text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {!hideIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {date ? formatDate(date, displayFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-modal+ w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus={initialFocus}
        />
      </PopoverContent>
    </Popover>
  );
}
