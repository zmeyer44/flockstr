"use client";
import Link from "next/link";
import {
  RiCalendarEventFill,
  RiCompass3Fill,
  RiQuestionAnswerFill,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const navigationItems = [
    {
      href: "/explore",
      name: "explore",
      icon: RiCompass3Fill,
    },
    {
      href: "/events",
      name: "events",
      icon: RiCalendarEventFill,
    },
    {
      href: "/explore",
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

const test = {
  id: "cd6bff4b8ddc18e8d99d4075c229d174b5101f6c3ae3bf178abe9176dd9e50c0",
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  created_at: 1699013775,
  kind: 1,
  tags: [
    [
      "a",
      "naddr1qqyxzdmyvyukyerpqyfhwumn8ghj7un9d3shjctzd3jjummjvupzqjm3fx8tusvwrsytszzf6k2jv73stwe208dnuznuw6xduxzqu50dqvzqqqrukvqkqn72",
    ],
  ],
  content: "This Event looks awesome!",
  sig: "68f3590eaf2a11a4b23692a029d11bc6cfe8bf15d7dc955553795fbbeb5eeec5786fb4bb9ca559af842582e086aa13f9005f2a8079b753ee95b49fcca33f6297",
};
