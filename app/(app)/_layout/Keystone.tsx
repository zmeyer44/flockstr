import Link from "next/link";
import Logo from "@/assets/Logo";
export default function Keystone() {
  return (
    <div className="center hidden sm:flex">
      <Link
        href="/explore"
        className="center fixed h-[var(--header-height)] w-[var(--sidebar-closed-width)] gap-x-3 border-r text-primary hover:text-primary/80 xl:w-[var(--sidebar-open-width)] xl:justify-start xl:pl-5"
      >
        <Logo className="h-[30px] w-[30px]" />
        <div className="hidden font-condensed text-xl font-semibold text-foreground xl:inline-flex">
          Flockstr
        </div>
      </Link>
    </div>
  );
}
