"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Icon from "../icon";
import { MediaUpload } from "./media-upload";

interface CoverPhotoProps {
  className?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const CoverPhoto = ({
  value,
  className,
  onChange,
  disabled,
}: CoverPhotoProps) => {
  return (
    <div
      className={cn(
        "w-full relative h-[200px] bg-muted-foreground/50",
        className
      )}
    >
      {value && (
        <Image src={value} alt="Cover photo" fill className="object-cover" />
      )}
      {onChange && (
        <MediaUpload
          endPoint="singlePhoto"
          onChange={(value) => onChange(value as string)}
          disabled={disabled}
        />
      )}
      {value && onChange && (
        <Icon
          icon={X}
          className="absolute top-0.5 right-0.5 bg-black/40 hover:bg-black/30 text-white"
          onClick={() => onChange?.("")}
        />
      )}
    </div>
  );
};
