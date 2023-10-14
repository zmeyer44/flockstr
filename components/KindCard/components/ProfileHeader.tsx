import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { HiCheckBadge } from "react-icons/hi2";

type ProfileHeaderProps = {};
export default function ProfileHeader({}: ProfileHeaderProps) {
  return (
    <div className="center gap-x-3">
      <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
        <AvatarImage
          src={
            "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
          }
          alt="user"
        />
        <AvatarFallback className="text-xs">SC</AvatarFallback>
      </Avatar>
      <div className="center 5 gap-1">
        <span className="text-xs uppercase text-muted-foreground">
          Derek Seivers
        </span>
        <HiCheckBadge className="h-4 w-4 text-primary" />
      </div>
    </div>
  );
}
