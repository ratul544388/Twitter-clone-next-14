"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MediaUpload } from "./media/media-upload";
import Icon from "./icon";
import { X } from "lucide-react";

interface CoverPhotoProps {
  className?: string;
  image?: string | null;
  onClick?: () => void;
  imageUpload?: (value: string) => void;
  disabled?: boolean;
  closeButton?: boolean;
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({
  image,
  className,
  onClick,
  imageUpload,
  disabled,
  closeButton,
}) => {
  console.log(image);
  return (
    <div
      className={cn(
        "w-full relative h-[200px] bg-muted-foreground/50",
        className
      )}
    >
      {image && (
        <Image src={image} alt="Cover photo" fill className="object-cover" />
      )}
      {imageUpload && (
        <MediaUpload
          endPoint="singlePhoto"
          onChange={(value) => imageUpload(value as string)}
          disabled={disabled}
        />
      )}
      {closeButton && image && (
        <Icon
          icon={X}
          className="absolute top-0.5 right-0.5 bg-black/40 hover:bg-black/30 text-white"
          onClick={() => imageUpload?.("")}
        />
      )}
    </div>
  );
};

export default CoverPhoto;
