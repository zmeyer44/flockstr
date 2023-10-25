"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { HiX } from "react-icons/hi";
import { useModal } from "@/app/_providers/modal/provider";

type ModalProps = React.HTMLAttributes<HTMLDivElement>;

export default function BareTemplate({ children, className }: ModalProps) {
  const modal = useModal();

  function handleClose() {
    modal?.hide();
  }

  return (
    <div
      className={cn(
        "relative w-full grow bg-background p-4 shadow md:rounded-lg md:border md:p-6",
        className,
      )}
    >
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 hidden text-muted-foreground transition-all hover:text-primary md:flex"
      >
        <HiX className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}
