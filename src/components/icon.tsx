import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon | IconType;
  className?: string;
  iconSize?: number;
  disabled?: boolean;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  icon: Icon,
  className,
  iconSize,
  disabled,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-fit w-fit p-2 hover:bg-sky-500/5 cursor-pointer rounded-full",
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      <Icon
        className="h-4 w-4"
        style={{ height: `${iconSize}px`, width: `${iconSize}px` }}
      />
    </div>
  );
};

export default Icon;
