import { HiOutlineUsers } from "react-icons/hi2";

import UserRow from "./UserRow";
type HostsContainerProps = {
  hosts: string[];
};
export default function HostsContainer({ hosts }: HostsContainerProps) {
  return (
    <div className="overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem]">
      <div className="flex items-center gap-x-3 px-2 pb-2">
        <HiOutlineUsers className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Hosts</h3>
      </div>
      <ul>
        {hosts.map((pubkey) => (
          <UserRow key={pubkey} pubkey={pubkey} />
        ))}
      </ul>
    </div>
  );
}
