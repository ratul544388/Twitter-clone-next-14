"use client";

import { FullCommunityType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../../../../../components/ui/badge";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { CircularPhotos } from "./circular-photos";

interface CommunityCardProps {
  community: FullCommunityType;
}

export const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <Link
      href={`/communities/${community.id}`}
      className="flex gap-3 p-3 hover:bg-sky-500/5 cursor-pointer"
    >
      <div className="w-[135px] aspect-[6/4] relative rounded-lg overflow-hidden">
        <Image
          src={community.coverPhoto}
          alt="cover photo"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-bold line-clamp-1">{community.name}</h1>
        <CircularPhotos community={community} size={32} />
        <Badge variant="outline" className="capitalize w-fit">
          {community.type.toLowerCase()}
        </Badge>
      </div>
    </Link>
  );
};

CommunityCard.Row = function CommunityCardRow({
  community,
}: {
  community: FullCommunityType;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[110px] relative aspect-[6/5] rounded-lg overflow-hidden bg-accent/50 hover:bg-accent">
        <Image
          src={community.coverPhoto}
          alt="cover photo"
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-2 px-2">
        <h1 className="text-sm font-semibold line-clamp-1">{community.name}</h1>
        <CircularPhotos community={community} />
      </div>
    </div>
  );
};

CommunityCard.Skeleton = function CommunityCardSkeleton({
  count,
}: {
  count: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 p-3">
          <Skeleton className="aspect-[6/4] w-[135px]" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </>
  );
};
