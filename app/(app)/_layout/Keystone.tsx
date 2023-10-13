import Link from "next/link";
import { RiLeafFill } from "react-icons/ri";

export default function Keystone() {
  return (
    <div className="center hidden sm:flex">
      <Link
        href="/"
        className="center fixed h-[var(--header-height)] w-[var(--sidebar-closed-width)] border-r xl:w-[var(--sidebar-open-width)] xl:justify-start xl:pl-5"
      >
        <RiLeafFill className="h-6 w-6" />
      </Link>
    </div>
  );
}
