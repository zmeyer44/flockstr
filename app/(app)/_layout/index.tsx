import BottomNav from "./BottomNav";
import Header from "./Header";
import Keystone from "./Keystone";
import MobileBanner from "./MobileBanner";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-layout absolute inset-0 w-screen">
      {/* Keystone */}
      <Keystone />

      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />
      <div className="relative flex  flex-1 shrink-0 grow justify-center overflow-x-hidden">
        <div className="flex-1 overflow-x-hidden px-5">{children}</div>
      </div>
      {/* Mobile Banner */}
      <MobileBanner />

      {/* BottomNav */}
      <BottomNav />
    </main>
  );
}
