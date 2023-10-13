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

export default function Sidebar() {
  const navigation = [
    {
      href: "",
      name: "home",
      label: "Home",
      icon: RiHome6Fill,
      current: true,
    },
    {
      href: "",
      name: "explore",
      label: "Explore",
      icon: RiCompassLine,
      current: false,
    },
    {
      href: "",
      name: "messages",
      label: "Messages",
      icon: RiQuestionAnswerLine,
      current: false,
    },
    {
      href: "",
      name: "zap",
      label: "Zap Flockstr",
      icon: HiOutlineLightningBolt,
      current: false,
    },
  ];
  return (
    <nav className="z-header- hidden h-[calc(100svh_-_var(--header-height))] w-[var(--sidebar-closed-width)] flex-col sm:flex">
      <div className="fixed bottom-0 flex h-[calc(100svh_-_var(--header-height))] w-[var(--sidebar-closed-width)] flex-col border-r xl:w-[var(--sidebar-open-width)]">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-stretch gap-y-2 p-4">
            {navigation.map((item) => (
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
                <span className="hidden text-base xl:flex">{item.label}</span>
              </Link>
            ))}
            <div className="center py-2 xl:justify-start">
              <Button size={"icon"} className="xl:hidden">
                <RiAddFill className="h-6 w-6" />
              </Button>
              <Button size={"lg"} className="hidden xl:flex">
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
