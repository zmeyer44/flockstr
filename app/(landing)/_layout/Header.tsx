"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RiMenu3Line, RiCloseFill } from "react-icons/ri";
import Logo from "@/assets/Logo";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [
    { name: "explore", label: "Explore", href: "/explore" },
    { name: "home", label: "Events", href: "/events" },
    { name: "about", label: "About", href: "/explore" },
    { name: "contact", label: "Contact", href: "/explore" },
  ];
  return (
    <header
      className={cn(
        "flex min-h-[var(--header-height)] shrink-0 grow-0 flex-col overflow-hidden px-6 transition-all",
        menuOpen ? "max-h-none" : "max-h-[var(--header-height)]",
      )}
    >
      <div className="center hidden min-h-[var(--header-height)] lg:flex">
        <ul className="flex w-full max-w-2xl items-center justify-between font-condensed text-base font-semibold text-zinc-800 hover:text-zinc-600">
          {navigation.slice(0, 2).map((item) => (
            <li key={item.name} className="">
              <Link href={item.href} className="flex p-1">
                <div className="center w-full ">{item.label}</div>
              </Link>
            </li>
          ))}
          <Link href="/">
            <Logo className="h-8 w-8 text-primary" />
          </Link>
          {navigation.slice(2, 4).map((item) => (
            <li key={item.name} className="">
              <Link href={item.href} className="flex p-1">
                <div className="center w-full">{item.label}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex min-h-[var(--header-height)] flex-1 items-stretch justify-between gap-x-4 lg:hidden">
        <div className="center justify-between gap-x-3 text-primary">
          <Logo className="h-7 w-7" />
        </div>
        <div className="flex grow items-center justify-end">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="center text-foregroun hover:text-muted-foreground"
          >
            {menuOpen ? (
              <RiCloseFill className="h-6 w-6" />
            ) : (
              <RiMenu3Line className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      <nav className="lg:hidden">
        <ul className="mb-5 flex w-full flex-col items-stretch border-t">
          {navigation.map((item) => (
            <li key={item.name} className="">
              <Link href={item.href} className="flex p-1">
                <div className="center w-full  rounded-sm bg-zinc-50 py-3 hover:bg-zinc-100">
                  {item.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
