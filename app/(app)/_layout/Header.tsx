import { RiMenu3Line, RiLeafFill } from "react-icons/ri";
import { UserMenu } from "./components/UserMenu";
import { Search } from "./components/Search";
import { Notifications } from "./components/Notifications";
import { MobileMenu } from "./components/MobileMenu";
export default function Header() {
  return (
    <header className="flex h-[var(--header-height)] shrink-0 grow-0 ">
      <div className="fixed z-header flex h-[var(--header-height)] w-full grow border-b bg-background p-5 sm:w-[calc(100vw_-_var(--sidebar-closed-width))] sm:border-b-0 sm:py-0 xl:w-[calc(100vw_-_var(--sidebar-open-width))]">
        <div className="flex flex-1 items-stretch justify-between gap-x-4 sm:border-b">
          <div className="center justify-between gap-x-3 text-foreground">
            <RiLeafFill className="h-6 w-6 sm:hidden" />
            <div className="font-semibold sm:text-lg">Flockstr</div>
          </div>
          <div className="flex grow items-center justify-end">
            <div className="sm:hidden">
              <MobileMenu />
            </div>
            <div className="hidden items-center gap-x-4 sm:flex">
              <Search />
              <Notifications />
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
