"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { randomId } from "@/lib/nostr";
import { unixTimeNowInSeconds } from "@/lib/nostr/dates";
import { addMinutesToDate, toUnix, convertToTimezone } from "@/lib/utils/dates";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { TimezoneSelector } from "@/components/ui/timezone";
import { Label } from "@/components/ui/label";

import SmallCalendarIcon from "@/components/EventIcons/DateIcon";
import LocationIcon from "@/components/EventIcons/LocationIcon";
import LocationSearchInput from "@/components/LocationSearch";
import Spinner from "../spinner";

import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { useModal } from "@/app/_providers/modal/provider";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useImageUpload from "@/lib/hooks/useImageUpload";

export default function CreateCalendarEventModal() {
  const modal = useModal();
  const now = new Date(new Date().setHours(12, 0, 0, 0));
  const [isLoading, setIsLoading] = useState(false);
  const {
    ImageUploadButton,
    clear,
    imagePreview,
    imageUrl,
    status: imageStatus,
  } = useImageUpload("event");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
  const [endDate, setEndDate] = useState<Date>(addMinutesToDate(now, 60));
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
    geohash: string;
  }>();
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const router = useRouter();

  async function handleSubmit() {
    console.log("CALLED", ndk, currentUser);
    if (!ndk || !currentUser) {
      alert("MISSING");
      return;
    }

    setIsLoading(true);
    if (!title) {
      setError("Please add a title");
      return;
    }

    try {
      const random = randomId();
      const tags: string[][] = [
        ["d", random],
        ["name", title],
        ["description", description],
        ["start", toUnix(convertToTimezone(startDate, timezone)).toString()],
        ["end", toUnix(convertToTimezone(endDate, timezone)).toString()],
        ["start_tzid", timezone],
        ["p", currentUser.pubkey, "", "host"],
      ];

      if (location) {
        tags.push([
          "location",
          `${location.name}, ${location.address}`,
          location.name,
          location.address,
        ]);
        tags.push([
          "address",
          `${location.name}, ${location.address}`,
          location.name,
          location.address,
        ]);
        tags.push(["g", location.geohash]);
      }

      if (imageUrl) {
        tags.push(["image", imageUrl]);
      }
      console.log("Adding ", tags);
      const preEvent = {
        content: description,
        pubkey: currentUser.pubkey,
        created_at: unixTimeNowInSeconds(),
        tags: tags,
        kind: 31923,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        toast.success("Event Created!");
        modal?.hide();
        router.push(`/event/${event.encode()}`);
      } else {
        toast.error("An error occured");
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  }

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
            "invisible-input !text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50 placeholder:hover:text-muted-foreground/80",
            title === "" && "max-h-[60px]",
          )}
        />
        <div className="space-y-4">
          <div className="flex w-full items-start gap-x-3">
            <div className="shrink-0">
              <SmallCalendarIcon date={startDate ?? new Date()} />
            </div>
            <div className="flex-1 divide-y overflow-hidden rounded-md bg-muted sm:max-w-[300px]">
              <div className="flex justify-between p-0.5 px-2 pl-3">
                <div className="flex w-[50px] items-center">Start</div>
                <div className="flex-1 shrink-0">
                  <div className="flex max-w-full break-keep">
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
                      className="shrink-0 break-keep"
                      inputClassName="pl-0 pr-1 break-keep min-w-fit"
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
                <div className="w-[50px flex items-center">End</div>
                <div className="flex-1 shrink-0">
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
                      className="shrink-0 break-keep"
                      inputClassName="pl-0 pr-1 break-keep min-w-fit"
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
            <div className="flex-1 divide-y overflow-hidden rounded-md bg-muted sm:max-w-[300px]">
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
          <div className="w-full">
            <Label className="text-muted-foreground">Event details</Label>
            <Textarea
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Some into about this event..."
            />
          </div>
          <div className="flex justify-end">
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl">
                <div className="">
                  <Image
                    alt="Image"
                    height="288"
                    width="288"
                    src={imagePreview}
                    className={cn(
                      "bg-bckground h-full rounded-xl object-cover object-center max-sm:max-h-[100px]",
                      imageStatus === "uploading" && "grayscale",
                      imageStatus === "error" && "blur-xl",
                    )}
                  />
                </div>
                {imageStatus === "uploading" && (
                  <button className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 text-background hover:bg-opacity-100">
                    <Spinner />
                  </button>
                )}
                {imageStatus === "success" && (
                  <button
                    onClick={clear}
                    className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 hover:bg-opacity-100"
                  >
                    <HiX
                      className="block h-4 w-4 text-background"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            ) : (
              <ImageUploadButton>
                <Button
                  className=""
                  variant={"outline"}
                  loading={imageStatus === "uploading"}
                >
                  {imageUrl ? "Uploaded!" : "Upload Image"}
                </Button>
              </ImageUploadButton>
            )}
          </div>

          <div className="flex">
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              disabled={imageStatus === "uploading"}
              className="w-full"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
