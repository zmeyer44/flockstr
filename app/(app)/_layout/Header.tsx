import Link from "next/link";
import AuthActions from "./components/AuthActions";
import Logo from "@/assets/Logo";
import dynamic from "next/dynamic";

const Search = dynamic(() => import("./components/Search"), {
  ssr: false,
});
export default function Header() {
  return (
    <header className="flex h-[var(--header-height)] shrink-0 grow-0 ">
      <div className="fixed z-header flex h-[var(--header-height)] w-full grow border-b bg-background p-5 sm:w-[calc(100vw_-_var(--sidebar-closed-width))] sm:border-b-0 sm:py-0 xl:w-[calc(100vw_-_var(--sidebar-open-width))]">
        <div className="flex flex-1 items-stretch justify-between gap-x-4 sm:border-b">
          <Link
            href="/explore"
            className="center justify-between gap-x-3 text-foreground"
          >
            <Logo className="h-[30px] w-[30px] text-primary sm:hidden" />
            <div className="font-condensed text-xl font-semibold text-foreground xl:hidden">
              Flockstr
            </div>
          </Link>
          <div className="flex grow items-center justify-end gap-x-4 xl:justify-between">
            <div className="hidden sm:flex">
              <Search />
            </div>
            <div className="flex items-center gap-x-4">
              <AuthActions />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
