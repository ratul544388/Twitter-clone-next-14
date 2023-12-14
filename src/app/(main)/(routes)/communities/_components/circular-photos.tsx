"use client";

import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";
import { FullCommunityType } from "@/types";
import Image from "next/image";

interface CircularPhotosProps {
  community: FullCommunityType;
  size?: number;
}

export const CircularPhotos = ({
  community,
  size = 32,
}: CircularPhotosProps) => {
  const photos = community.members.slice(0, 5).map((member) => {
    return member.user.image;
  });
  return (
    <div
      className={cn("flex h-8 items-center relative")}
      style={{ width: `${size * 0.8 * photos.length}px` }}
    >
      {photos.map((photo, index) => (
        <div
          key={photo}
          className="relative aspect-square rounded-full"
          style={{
            minWidth: `${size}px`,
            transform: `translateX(${-50 * index}%)`,
          }}
        >
          <Image
            src={photo}
            key={photo}
            fill
            alt="image"
            className="rounded-full absolute"
          />
        </div>
      ))}
    </div>
  );
};
