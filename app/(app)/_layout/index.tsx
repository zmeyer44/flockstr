import BottomNav from "./BottomNav";
import Header from "./Header";
import Keystone from "./Keystone";
import MobileBanner from "./MobileBanner";
import Sidebar from "./Sidebar";
import dynamic from "next/dynamic";

const CommandDialog = dynamic(() => import("./components/CommandDialog"), {
  ssr: false,
});
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-layout w-screen sm:absolute sm:inset-0">
      {/* Keystone */}
      <Keystone />

      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />
      <div className="relative flex flex-1 shrink-0 grow justify-center sm:w-[calc(100vw_-_var(--sidebar-closed-width))] xl:w-[calc(100vw_-_var(--sidebar-open-width))]">
        <div className="flex-1 overflow-x-hidden pb-5">{children}</div>
      </div>
      {/* Mobile Banner */}
      <MobileBanner />

      {/* BottomNav */}
      <BottomNav />
      <CommandDialog />
    </main>
  );
}
