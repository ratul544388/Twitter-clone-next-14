"use client";

import { cn } from "@/lib/utils";
import { Tweet, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface MediaPreviewProps {
  tweet: Tweet & {
    user: User;
  };
}

export const MediaPreview = ({ tweet }: MediaPreviewProps) => {
  const length = tweet.media.length;
  const slicedMedia = tweet.media.slice(0, 4);

  if (length === 0) return null;
  return (
    <div
      className={cn(
        "grid w-full aspect-square max-h-[320px] relative rounded-xl overflow-hidden",
        length > 1 && "border-[1.5px]",
        length === 2 && "max-h-[250px]",
        length >= 2 && "grid-cols-2"
      )}
    >
      {slicedMedia.map((item, index) => (
        <Link
          href={`/${tweet.user.username}/status/${tweet.id}/media/${index + 1}`}
          key={item}
          className={cn(
            "relative border-[1.5px] rounded-xl overflow-hidden",
            length === 3 && index === 2 && "col-span-2"
          )}
        >
          <Image
            src={item}
            alt={`photo-${index + 1}`}
            fill
            className="object-cover"
          />
          {index === 3 && length > 4 && (
            <p className="absolute text-sm text-muted-foreground font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {length - 4} More
            </p>
          )}
        </Link>
      ))}
    </div>
  );
};
