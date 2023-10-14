import { ReactElement } from "react";

export default function ModalLayout({ children }: { children: ReactElement }) {
  return (
    <div className="z-overlay fixed inset-y-[10px] left-[10px] right-[10px] rounded-lg border bg-background px-4 sm:left-[calc(10px_+_var(--sidebar-closed-width))] xl:left-[calc(10px_+_var(--sidebar-open-width))]">
      {children}
    </div>
  );
}
