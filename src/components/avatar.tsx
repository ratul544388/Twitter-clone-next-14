"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MediaUpload } from "./media/media-upload";
import { Skeleton } from "./ui/skeleton";

interface AvatarProps {
  classname?: string;
  image?: string | null;
  onClick?: () => void;
  size?: number;
}

export const Avatar = ({
  image,
  classname,
  onClick,
  size = 38,
}: AvatarProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "aspect-square relative rounded-full overflow-hidden",
        classname
      )}
      style={{ minWidth: `${size}px`, width: `${size}px` }}
    >
      <Image
        src={image || "/images/placeholder.jpg"}
        alt="Avatar"
        fill
        className="object-cover"
      />
    </div>
  );
};

Avatar.Skeleton = function AvatarSkeleton() {
  return <Skeleton className="min-h-[40px] min-w-[40px] rounded-full" />;
};
