import Link from "next/link";
import {
  RiHome6Fill,
  RiCompass3Fill,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const navigationItems = [
    {
      href: "",
      name: "home",
      icon: RiHome6Fill,
      current: true,
    },
    {
      href: "",
      name: "explore",
      icon: RiCompass3Fill,
      current: false,
    },
    {
      href: "",
      name: "messages",
      icon: RiQuestionAnswerFill,
      current: false,
    },
  ];
  return (
    <footer className="z-header- flex h-[var(--bottom-nav-height)] w-full sm:hidden">
      <div className="bottom-tabs fixed inset-x-0 bottom-0 flex h-[var(--bottom-nav-height)] flex-1 items-center justify-between border-t bg-background px-4">
        {navigationItems.map((item) => (
          <Link href={item.href} className="center group group flex-1">
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
        ))}
      </div>
    </footer>
  );
}
