import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="absolute inset-0 w-screen bg-white pb-20">
      <Header />
      <div className="relative z-0 flex shrink-0 grow flex-col justify-center">
        <div className="flex-1">{children}</div>
        {/* <Footer /> */}
      </div>
    </main>
  );
}
