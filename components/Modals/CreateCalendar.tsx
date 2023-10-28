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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
    if (!name) {
      setError("Please add a title");
      return;
    }

    try {
      const random = randomId();
      const tags: string[][] = [
        ["d", random],
        ["name", name],
        ["description", description],
        ["p", currentUser.pubkey, "", "host"],
      ];

      if (imageUrl) {
        tags.push(["image", imageUrl]);
      }
      const preEvent = {
        content: description,
        pubkey: currentUser.pubkey,
        created_at: unixTimeNowInSeconds(),
        tags: tags,
        kind: 31924,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        toast.success("Calendar Created!");
        modal?.hide();
        router.push(`/calendar/${event.encode()}`);
      } else {
        toast.error("An error occured");
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  }

  const nameRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(nameRef.current, name);

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
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Calendar Name"
          className={cn(
            "invisible-input !text-3xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50 placeholder:hover:text-muted-foreground/80",
            name === "" && "max-h-[60px]",
          )}
        />
        <div className="space-y-4">
          <div className="w-full">
            <Label className="text-muted-foreground">About</Label>
            <Textarea
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Some into about this calendar..."
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
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
