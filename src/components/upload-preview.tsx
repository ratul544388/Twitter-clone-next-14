import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Icon from "./icon";

interface UploadPreviewProps {
  value: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

export const UploadPreview = ({
  value,
  onChange,
  className,
}: UploadPreviewProps) => {
  if (value.length === 0) return null;

  return (
    <div
      className={cn(
        "pl-[50px] grid gap-2 grid-cols-1",
        value.length === 2 && "grid-cols-2",
        value.length >= 3 && "grid-cols-3",
        className
      )}
    >
      {value.map((item) => (
        <div
          key={item}
          className="relative overflow-hidden rounded-xl max-w-[300px] aspect-square border-[1.5px]"
        >
          <Image src={item} alt="media" fill className="object-cover" />
          {onChange && (
            <Icon
              onClick={() => onChange?.(value.filter((url) => item !== url))}
              icon={X}
              iconSize={10}
              className={cn(
                "absolute top-1 right-1 bg-neutral-600 hover:bg-neutral-600/80 text-white",
                value.length >= 3 && "top-0.5 right-0.5"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
