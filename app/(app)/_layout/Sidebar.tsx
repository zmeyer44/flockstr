"use client";

import Link from "next/link";
import {
  RiHome6Fill,
  RiCompassLine,
  RiCompass3Fill,
  RiQuestionAnswerLine,
  RiAddFill,
  RiSettings4Fill,
  RiSettings4Line,
} from "react-icons/ri";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ZapPicker from "@/components/Modals/ZapPicker";
import { useModal } from "@/app/_providers/modal/provider";
import { IconType } from "react-icons";

type NavigationLink = {
  type: "link";
  href: string;
};
type NavigationButton = {
  type: "button";
  onClick: () => void;
};
type NavigationElement = {
  name: string;
  label: string;
  icon: IconType;
  current: boolean;
  active: boolean;
} & (NavigationLink | NavigationButton);

export default function Sidebar() {
  const modal = useModal();

  const navigation: NavigationElement[] = [
    {
      href: "",
      name: "home",
      label: "Home",
      icon: RiHome6Fill,
      type: "link",
      current: true,
      active: true,
    },
    {
      href: "",
      name: "explore",
      label: "Explore",
      icon: RiCompassLine,
      type: "link",
      current: false,
      active: false,
    },
    {
      href: "",
      name: "messages",
      label: "Messages",
      icon: RiQuestionAnswerLine,
      type: "link",
      current: false,
      active: false,
    },
    {
      onClick: () => modal?.show(<ZapPicker />),
      name: "zap",
      label: "Zap Flockstr",
      icon: HiOutlineLightningBolt,
      type: "button",
      current: false,
      active: true,
    },
  ];
  return (
    <nav className="z-header- hidden h-[calc(100svh_-_var(--header-height))] w-[var(--sidebar-closed-width)] flex-col sm:flex">
      <div className="fixed bottom-0 flex h-[calc(100svh_-_var(--header-height))] w-[var(--sidebar-closed-width)] flex-col border-r xl:w-[var(--sidebar-open-width)]">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-stretch gap-y-2 p-4">
            {navigation.map((item) => {
              if (item.type === "link") {
                if (item.active) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted xl:justify-start xl:gap-x-4 xl:p-2.5",
                        item.current
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn("h-6 w-6 shrink-0")}
                        aria-hidden="true"
                      />
                      <span className="hidden text-base xl:flex">
                        {item.label}
                      </span>
                    </Link>
                  );
                } else {
                  return (
                    <TooltipProvider key={item.name}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted xl:justify-start xl:gap-x-4 xl:p-2.5",
                              item.current
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <item.icon
                              className={cn("h-6 w-6 shrink-0")}
                              aria-hidden="true"
                            />
                            <span className="hidden text-base xl:flex">
                              {item.label}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent align="start">
                          <p>Coming Soon</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }
              } else {
                if (item.active) {
                  return (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className={cn(
                        "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted xl:justify-start xl:gap-x-4 xl:p-2.5",
                        item.current
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn("h-6 w-6 shrink-0")}
                        aria-hidden="true"
                      />
                      <span className="hidden text-base xl:flex">
                        {item.label}
                      </span>
                    </button>
                  );
                } else {
                  return (
                    <TooltipProvider key={item.name}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              "center group relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted xl:justify-start xl:gap-x-4 xl:p-2.5",
                              item.current
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <item.icon
                              className={cn("h-6 w-6 shrink-0")}
                              aria-hidden="true"
                            />
                            <span className="hidden text-base xl:flex">
                              {item.label}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent align="start">
                          <p>Coming Soon</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }
              }
            })}
            <div className="center py-2 xl:justify-start">
              <Button
                onClick={() => modal?.show(<ZapPicker />)}
                size={"icon"}
                className="xl:hidden"
              >
                <RiAddFill className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => modal?.show(<ZapPicker />)}
                size={"lg"}
                className="hidden xl:flex"
              >
                <div className="center gap-x-1.5">
                  <RiAddFill className="h-6 w-6" />
                  <span>Add Note</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end p-4">
          <button
            className={cn(
              "center relative min-h-[48px] min-w-[48px] rounded-lg hover:bg-muted xl:justify-start xl:gap-x-4 xl:p-2.5",

              "text-muted-foreground group-hover:text-foreground",
            )}
          >
            <RiSettings4Line
              className={cn("h-6 w-6 shrink-0")}
              aria-hidden="true"
            />
            <span className="hidden text-base xl:flex">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
