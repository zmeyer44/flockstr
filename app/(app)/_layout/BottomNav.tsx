"use client";
import Link from "next/link";
import {
  RiHome6Fill,
  RiCompass3Fill,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const navigationItems = [
    {
      href: "/app",
      name: "home",
      icon: RiHome6Fill,
    },
    {
      href: "/explore",
      name: "explore",
      icon: RiCompass3Fill,
    },
    {
      href: "",
      name: "messages",
      icon: RiQuestionAnswerFill,
    },
  ];
  return (
    <footer className="z-header- flex h-[var(--bottom-nav-height)] w-full sm:hidden">
      <div className="bottom-tabs fixed inset-x-0 bottom-0 flex h-[var(--bottom-nav-height)] flex-1 items-stretch justify-between border-t bg-background px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="center group group flex-1"
          >
            <item.icon
              className={cn(
                pathname === item.href
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
