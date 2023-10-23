"use client";

import { useState, useRef, useEffect } from "react";
import Template from "./Template";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { Button } from "@/components/ui/button";
import { HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";
import {
  addMinutesToDate,
  convertToTimezoneDate,
  convertToTimezone,
} from "@/lib/utils/dates";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { TimezoneSelector } from "../ui/timezone";
import SmallCalendarIcon from "../EventIcons/DateIcon";
import LocationIcon from "../EventIcons/LocationIcon";
import LocationSearchInput from "../LocationSearch";
import { useModal } from "@/app/_providers/modal/provider";

export default function CreateCalendarEventModal() {
  const modal = useModal();
  const now = new Date(new Date().setHours(12, 0, 0, 0));
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(now);
  const startTime = `${
    startDate?.getHours().toLocaleString().length === 1
      ? "0" + startDate?.getHours().toLocaleString()
      : startDate?.getHours()
  }:${
    startDate?.getMinutes().toLocaleString().length === 1
      ? "0" + startDate?.getMinutes().toLocaleString()
      : startDate?.getMinutes()
  }`;
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setHours(13)),
  );
  const endTime = `${
    endDate?.getHours().toLocaleString().length === 1
      ? "0" + endDate?.getHours().toLocaleString()
      : endDate?.getHours()
  }:${
    endDate?.getMinutes().toLocaleString().length === 1
      ? "0" + endDate?.getMinutes().toLocaleString()
      : endDate?.getMinutes()
  }`;
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [location, setLocation] = useState<{
    address: string;
    name: string;
    coordinates: { lat: number; lng: number };
  }>();

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate.getTime() > endDate.getTime()) {
        setEndDate(addMinutesToDate(startDate, 60));
      }
    }
  }, [startDate]);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(titleRef.current, title);

  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div
      className={cn(
        "relative w-full grow bg-background p-4 shadow md:rounded-lg md:border md:p-6",
        "md:max-w-[600px]",
      )}
    >
      <button
        onClick={() => modal?.hide()}
        className="absolute right-4 top-4 hidden text-muted-foreground transition-all hover:text-primary md:flex"
      >
        <HiX className="h-4 w-4" />
      </button>
      <div className="">
        <Textarea
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Name"
          className={cn(
            "resize-none break-words border-0 bg-transparent p-0 text-3xl font-bold text-foreground shadow-none outline-none placeholder:text-muted-foreground/50 placeholder:hover:text-muted-foreground/80 focus-visible:ring-0",
            title === "" && "max-h-[60px]",
          )}
        />
        <div className="space-y-4">
          <div className="flex w-full items-start gap-x-3">
            <div className="shrink-0">
              <SmallCalendarIcon date={startDate ?? new Date()} />
            </div>
            <div className="max-w-[300px] flex-1 divide-y overflow-hidden rounded-md bg-muted">
              <div className="flex justify-between p-0.5 px-2 pl-3">
                <div className="flex w-[70px] shrink-0 items-center">Start</div>
                <div className="flex-1">
                  <div className="flex max-w-full bg-secondary">
                    <DatePicker
                      displayFormat="ddd, MMM D"
                      date={startDate}
                      onDateChange={(newDate) =>
                        setStartDate((prev) => {
                          if (!prev || !newDate) return newDate ?? now;
                          return new Date(
                            newDate.setHours(
                              prev.getHours(),
                              prev.getMinutes(),
                            ),
                          );
                        })
                      }
                      hideIcon={true}
                    />
                    <TimePicker
                      className="max-w-fit pl-0 pr-1"
                      value={startTime}
                      onChange={(newTime) =>
                        setStartDate(
                          (prev) =>
                            new Date(
                              prev!.setHours(
                                parseInt(newTime.split(":")[0] as string),
                                parseInt(newTime.split(":")[1] as string),
                              ),
                            ),
                        )
                      }
                      hideIcon={true}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between p-0.5 px-2 pl-3">
                <div className="flex w-[70px] shrink-0 items-center">End</div>
                <div className="flex-1">
                  <div className="flex max-w-full bg-secondary">
                    <DatePicker
                      displayFormat="ddd, MMM D"
                      date={endDate}
                      onDateChange={(newDate) =>
                        setEndDate((prev) => {
                          if (!prev || !newDate) return newDate ?? now;
                          return new Date(
                            newDate.setHours(
                              prev.getHours(),
                              prev.getMinutes(),
                            ),
                          );
                        })
                      }
                      hideIcon={true}
                    />
                    <TimePicker
                      className="max-w-fit pl-0 pr-1"
                      value={endTime}
                      onChange={(newTime) =>
                        setEndDate(
                          (prev) =>
                            new Date(
                              prev!.setHours(
                                parseInt(newTime.split(":")[0] as string),
                                parseInt(newTime.split(":")[1] as string),
                              ),
                            ),
                        )
                      }
                      hideIcon={true}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between overflow-hidden p-0.5 px-1 pl-3">
                <div className="flex-1 text-xs text-muted-foreground">
                  <div className="flex max-w-full justify-start bg-secondary">
                    <TimezoneSelector
                      hideIcon={false}
                      className="px-0 pr-1 font-normal"
                      value={timezone}
                      onChange={(newTimezone) => setTimezone(newTimezone)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-start gap-x-3">
            <div className="shrink-0">
              <LocationIcon />
            </div>
            <div className="max-w-[300px] flex-1 divide-y overflow-hidden rounded-md bg-muted">
              <div className="flex justify-between p-0.5 px-1">
                <div className="flex-1">
                  <div className="flex max-w-full bg-secondary">
                    <LocationSearchInput
                      location={location}
                      onSelect={(l) => setLocation(l)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
