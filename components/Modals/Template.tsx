"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { HiX } from "react-icons/hi";
import { useModal } from "@/app/_providers/modal/provider";

type ModalProps = {
  title: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Template({ title, children, className }: ModalProps) {
  const modal = useModal();

  function handleClose() {
    modal?.hide();
  }

  return (
    <div
      className={cn(
        "relative w-full grow border bg-background p-4 shadow md:rounded-lg md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1
          style={{
            fontFamily: '"DM Sans", sans-serif',
          }}
          className="font-condensed text-xl font-semibold text-foreground"
        >
          {title}
        </h1>
        <button
          onClick={handleClose}
          className="hidden text-muted-foreground transition-all hover:text-primary md:flex"
        >
          <HiX className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  );
}
