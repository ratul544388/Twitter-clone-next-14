"use client";

import { Button } from "@/components/ui/button";
import { Tweet, User } from "@prisma/client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";

interface MediaClientProps {
  tweet: Tweet & {
    user: User;
  };
  number: number;
}

export const MediaClient = ({ tweet, number }: MediaClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const media = tweet.media;
  const hasNextButton = media[number] !== undefined;
  const hasPreviousButton = media[number - 2] !== undefined;

  const handleClose = () => {
    const isPost = searchParams.get("post");
    if (isPost) {
      router.push(`/${tweet.user.username}/status/${tweet.id}`);
    } else {
      router.push("/");
    }
  };

  const handleChangePhoto = (photoNumber: number) => {
    const currentQuery = qs.parse(searchParams.toString());
    const url = qs.stringifyUrl(
      {
        url: `/${tweet.user.username}/status/${tweet.id}/media/${photoNumber}`,
        query: {
          ...currentQuery,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <div onClick={handleClose} className="fixed inset-0 backdrop-blur-sm z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 -translate-x-1/2 h-full top-1/2 -translate-y-1/2 xs:rounded-xl sm:h-[90vh] w-full sm:w-[90vw] lg:w-[60vw] border shadow-xl z-50 bg-background backdrop-blur-sm"
      >
        {hasPreviousButton && (
          <Button
            onClick={() => handleChangePhoto(number - 1)}
            variant="outline"
            className="h-14 w-14 z-[100] absolute top-1/2 -translate-y-1/2 left-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div className="absolute inset-0 sm:inset-[64px]">
          <Image
            src={media[number - 1]}
            alt={`media_${number}`}
            fill
            className="object-contain"
          />
        </div>
        {hasNextButton && (
          <Button
            onClick={() => handleChangePhoto(number + 1)}
            variant="outline"
            className="h-14 w-14 z-[100] absolute top-1/2 -translate-y-1/2 right-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          </Button>
        )}
        <Button
          onClick={handleClose}
          size="icon"
          variant="outline"
          className="text-muted-foreground hover:text-foreground absolute top-1 right-1"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
