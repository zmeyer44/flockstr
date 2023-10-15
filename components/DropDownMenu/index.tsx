import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

type OptionLink = {
  href: string;
  type: "link";
};
type OptionButton = {
  onClick: () => void;
  type: "button";
};
type Option = {
  label: string;
} & (OptionLink | OptionButton);

type DropDownMenuProps = {
  options: Option[];
  children: ReactNode;
};

export default function DropDownMenu({ children, options }: DropDownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="z-header+ w-56" align="end" forceMount>
        <DropdownMenuGroup>
          {options.map((o) => {
            if (o.type === "button") {
              return (
                <DropdownMenuItem key={o.label}>
                  <button
                    onClick={o.onClick}
                    className="flex w-full justify-between"
                  >
                    {o.label}
                  </button>
                </DropdownMenuItem>
              );
            } else {
              return (
                <DropdownMenuItem key={o.label}>
                  <Link href={o.href} className="flex w-full justify-between">
                    {o.label}
                  </Link>
                </DropdownMenuItem>
              );
            }
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
