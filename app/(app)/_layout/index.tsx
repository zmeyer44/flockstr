import BottomNav from "./BottomNav";
import Header from "./Header";
import Keystone from "./Keystone";
import MobileBanner from "./MobileBanner";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-layout w-screen sm:absolute sm:inset-0">
      {/* Keystone */}
      <Keystone />

      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />
      <div className="relative flex  flex-1 shrink-0 grow justify-center overflow-x-hidden">
        <div className="flex-1 overflow-x-hidden px-5 pb-5">{children}</div>
      </div>
      {/* Mobile Banner */}
      <MobileBanner />

      {/* BottomNav */}
      <BottomNav />
    </main>
  );
}
