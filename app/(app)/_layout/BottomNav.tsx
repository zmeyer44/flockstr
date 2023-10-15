import Link from "next/link";
import {
  RiHome6Fill,
  RiCompass3Fill,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BottomNav() {
  const navigationItems = [
    {
      href: "",
      name: "home",
      icon: RiHome6Fill,
      current: true,
      active: true,
    },
    {
      href: "",
      name: "explore",
      icon: RiCompass3Fill,
      current: false,
      active: false,
    },
    {
      href: "",
      name: "messages",
      icon: RiQuestionAnswerFill,
      current: false,
      active: false,
    },
  ];
  return (
    <footer className="z-header- flex h-[var(--bottom-nav-height)] w-full bg-background sm:hidden">
      <div className="fixed inset-x-0 bottom-0 flex h-[var(--bottom-nav-height)] flex-1 items-center justify-between border-t bg-background px-4">
        {navigationItems.map((item) => {
          if (item.active) {
            return (
              <Link href={item.href} className="center group flex-1">
                <item.icon
                  className={cn(
                    item.current
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                    "h-6 w-6 shrink-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          } else {
            return (
              <TooltipProvider key={item.name}>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="center group flex-1">
                    <div className="center group flex-1">
                      <item.icon
                        className={cn(
                          item.current
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                          "h-6 w-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent align="center">
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
        })}
        <div className="standalone:block hidden h-[20px] w-full"></div>
      </div>
    </footer>
  );
}
