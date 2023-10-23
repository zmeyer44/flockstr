import { HiOutlineMapPin } from "react-icons/hi2";

export default function LocationIcon() {
  return (
    <div className="center h-10 w-10 overflow-hidden rounded-sm border bg-muted text-muted-foreground">
      <div className="center w-full text-center">
        <div className="text-center text-[14px] font-medium">
          <HiOutlineMapPin className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
