import { cn } from "@/lib/utils";

type TileIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: (props: any) => JSX.Element;
  label: string;
  active?: boolean;
};

export default function TileIconButton({
  icon: Icon,
  label,
  active,
  className,
  ...props
}: TileIconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "hover flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary focus:border-primary",
        active && "border-primary",
        className,
      )}
    >
      <Icon className="mb-3 h-6 w-6" />
      <span className="font-semibold">{label}</span>
    </button>
  );
}
