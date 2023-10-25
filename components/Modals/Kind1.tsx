"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { HiX, HiOutlinePaperClip } from "react-icons/hi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { useModal } from "@/app/_providers/modal/provider";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions/create";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useImageUpload from "@/lib/hooks/useImageUpload";

type CreateKind1ModalProps = {
  tags?: string[][];
};

export default function CreateKind1Modal({
  tags: initialTags = [],
}: CreateKind1ModalProps) {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const {
    ImageUploadButton,
    ImagePreview,
    clear,
    imagePreview,
    imageUrl,
    status: imageStatus,
  } = useImageUpload("event");
  const { ndk } = useNDK();
  const { currentUser } = useCurrentUser();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(contentRef.current, content);

  async function handleSubmit() {
    if (!ndk || !currentUser) return;
    setIsLoading(true);
    try {
      const tags: string[][] = initialTags;
      let noteContent = content;

      if (imageUrl) {
        tags.push(["r", imageUrl]);
        noteContent += `\n${imageUrl}`;
      }
      const preEvent = {
        content: noteContent,
        pubkey: currentUser.pubkey,
        tags: tags,
        kind: 1,
      };
      const event = await createEvent(ndk, preEvent);
      if (event) {
        toast.success("Event Created!");
        modal?.hide();
      } else {
        toast.error("An error occured");
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "relative w-full grow bg-background p-4 shadow md:rounded-lg md:border md:p-6",
        "md:max-w-[450px]",
      )}
    >
      <button
        onClick={() => modal?.hide()}
        className="absolute right-4 top-4 hidden text-muted-foreground transition-all hover:text-primary md:flex"
      >
        <HiX className="h-4 w-4" />
      </button>
      <div className="space-y-4">
        <div className="">
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
            className={cn(
              "invisible-input min-h-[60px] text-[1.5rem] font-medium text-foreground placeholder:text-muted-foreground/70",
              content.length > 50 && "text-[1.25rem]",
              content.length > 120 && "text-[1rem]",
            )}
          />
          <div className="mt-1 flex items-center text-muted-foreground">
            {imagePreview ? (
              <ImagePreview className="" />
            ) : (
              <ImageUploadButton>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full"
                >
                  <HiOutlinePaperClip className="h-4 w-4" />
                </Button>
              </ImageUploadButton>
            )}
          </div>
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
  );
}
