"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type RouteChangeProps = (url: string) => void;

export default function NavigationEvents(callback: RouteChangeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname ?? ""}?${searchParams?.toString() ?? ""}`;
    callback(url);
  }, [pathname, searchParams]);

  return null;
}
