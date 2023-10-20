"use client";

import { Input } from "@/components/ui/input";
import { commandDialogAtom } from "./CommandDialog";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
export default function Search() {
  const [open, setOpen] = useAtom(commandDialogAtom);
  return (
    <div>
      {/* <Input
        type="search"
        placeholder="Search..."
        className="sm:w-[200px] lg:w-[300px]"
        onFocus={() => setOpen(true)}
      /> */}
      <Button
        onClick={() => setOpen(true)}
        variant={"outline"}
        className="items-center justify-start rounded-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
