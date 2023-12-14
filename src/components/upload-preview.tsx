import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Icon from "./icon";

interface UploadPreviewProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const UploadPreview = ({
  value,
  onChange,
  className,
}: UploadPreviewProps) => {
  if (value.length === 0) return null;

  const onRemove = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div
      className={cn(
        "pb-2 border-b-[1.5px] pl-[50px] mb-2 grid gap-2 grid-cols-1",
        value.length === 2 && "grid-cols-2",
        value.length >= 3 && "grid-cols-3",
        // value.length === 4 && "grid-cols-4",
        // value.length === 5 && "grid-cols-5",
        className
      )}
    >
      {value.map((item) => (
        <div
          key={item}
          className="relative overflow-hidden rounded-xl max-w-[300px] aspect-square border-[1.5px]"
        >
          <Image src={item} alt="media" fill className="object-cover" />
          <Icon
            onClick={() => onRemove(item)}
            icon={X}
            iconSize={10}
            className={cn(
              "absolute top-1 right-1 bg-neutral-600 hover:bg-neutral-600/80 text-white",
              value.length >= 3 && "top-0.5 right-0.5"
            )}
          />
        </div>
      ))}
    </div>
  );
};
