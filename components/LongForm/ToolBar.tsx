"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { Textarea } from "../ui/textarea";
import useAutosizeTextArea from "@/lib/hooks/useAutoSizeTextArea";
import { HiOutlinePhoto } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import useImageUpload from "@/lib/hooks/useImageUpload";

interface ToolbarProps {
  initialData?: {
    title?: string;
    summary?: string;
    image?: string;
  };
  preview?: boolean;
  onSubmit: ({
    title,
    summary,
    image,
  }: {
    title: string;
    summary: string;
    image?: string;
  }) => void;
}

export const Toolbar = ({ initialData, preview, onSubmit }: ToolbarProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [image, setImage] = useState(initialData?.image);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(titleRef.current, title);
  useAutosizeTextArea(summaryRef.current, summary);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [value, setValue] = useState(initialData?.title);

  const { ImageUploadButton, imageUrl, ImagePreview, status } =
    useImageUpload("event");
  const update = () => {
    console.log("Update");
  };

  const enableInput = (type: "title" | "summary") => {
    if (preview) return;
    if (type === "title") {
      setIsEditingTitle(true);
      setTimeout(() => {
        titleRef.current?.focus();
      }, 0);
    } else {
      summaryRef.current?.focus();
      setIsEditingSummary(true);
      setTimeout(() => {
        summaryRef.current?.focus();
      }, 0);
    }
  };

  const disableInput = () => {
    setIsEditingTitle(false);
    setIsEditingSummary(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({ title, summary, image: imageUrl ?? "" });
      setLoading(false);
    } catch (err) {
      console.log("Error", err);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-center gap-x-1 py-4">
        <div className="opacity-0 group-hover:opacity-100">
          {!initialData?.image && !preview && (
            <ImageUploadButton>
              <Button
                className="text-xs text-muted-foreground"
                variant="outline"
                size="sm"
              >
                <HiOutlinePhoto className="mr-2 h-4 w-4" />
                Add cover
              </Button>
            </ImageUploadButton>
          )}
        </div>
        <Button
          disabled={status === "uploading"}
          loading={loading}
          onClick={handleSubmit}
          className="ml-auto"
        >
          Publish
        </Button>
      </div>
      {isEditingTitle && !preview ? (
        <Textarea
          ref={titleRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className={cn(
            "resize-none break-words border-0 bg-transparent p-0 text-5xl font-bold text-foreground shadow-none outline-none focus-visible:ring-0",
            title === "" && "max-h-[60px]",
          )}
        />
      ) : (
        <div
          onClick={() => enableInput("title")}
          className="break-words pb-[11.5px] text-5xl font-bold text-foreground outline-none"
        >
          {title || "Untitled"}
        </div>
      )}

      {isEditingSummary && !preview ? (
        <Textarea
          ref={summaryRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a short summary of your content..."
          className={cn(
            "min-h-0 resize-none break-words border-0 bg-transparent p-0 text-base text-foreground shadow-none outline-none focus-visible:ring-0",
            summary === "" && "!max-h-[35.5px]",
          )}
        />
      ) : (
        <div
          onClick={() => enableInput("summary")}
          className="break-words pb-[11.5px] text-base text-muted-foreground/80 outline-none"
        >
          {summary || "Write a short summary of your content..."}
        </div>
      )}
      <ImagePreview />
    </div>
  );
};
