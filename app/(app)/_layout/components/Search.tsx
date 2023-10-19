"use client";

import { Input } from "@/components/ui/input";
import { commandDialogAtom } from "./CommandDialog";
import { useAtom } from "jotai";
export default function Search() {
  const [open, setOpen] = useAtom(commandDialogAtom);
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="sm:w-[200px] lg:w-[300px]"
        onFocus={() => setOpen(true)}
      />
    </div>
  );
}
