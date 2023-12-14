"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Icon from "../icon";
import { MediaUpload } from "./media-upload";

interface CoverPhotoProps {
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const ProfilePhoto = ({
  value,
  className,
  onChange,
  disabled,
}: CoverPhotoProps) => {
  return (
    <div
      className={cn(
        "w-[130px] aspect-square rounded-full border-4 border-black/10 relative bg-muted-foreground/50 overflow-hidden",
        className
      )}
    >
      <Image src={value} alt="Cover photo" fill className="object-cover" />
      {onChange && (
        <MediaUpload
          endPoint="singlePhoto"
          onChange={(value) => onChange(value as string)}
          disabled={disabled}
        />
      )}
    </div>
  );
};
