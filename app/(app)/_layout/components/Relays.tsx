import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiRelay } from "react-icons/si";
import { RELAYS } from "@/constants";
export function Relays() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="center relative h-8 w-8 rounded-full bg-muted text-foreground"
        >
          <SiRelay className="h-[18px] w-[18px] text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-header+ w-56" align="end" forceMount>
        {RELAYS.map((r) => (
          <DropdownMenuGroup key={r}>
            <DropdownMenuItem>{r}</DropdownMenuItem>
          </DropdownMenuGroup>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Manage Relays
          <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
