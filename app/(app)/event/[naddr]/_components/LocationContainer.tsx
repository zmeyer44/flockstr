import LocationBoxRaw from "@/components/LocationPreview/LocationBoxRaw";
import { HiOutlineMapPin, HiCheckBadge, HiOutlineUsers } from "react-icons/hi2";

type LocationContainerProps = {
  address: string;
  geohash: string;
};
export default function LocationContainer({
  address,
  geohash,
}: LocationContainerProps) {
  return (
    <div className="overflow-hidden rounded-[1rem] border bg-muted p-[0.5rem] @container">
      <div className="flex items-center gap-x-3 px-2 pb-2">
        <HiOutlineMapPin className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Location</h3>
      </div>
      <div className="h-[150px] overflow-hidden rounded-lg">
        <LocationBoxRaw geohash={geohash} address={address} />
      </div>
      <div className="flex items-center @lg:px-2 @lg:pt-1">
        <p className="pt-1.5 text-xs text-muted-foreground">{address}</p>
      </div>
    </div>
  );
}
