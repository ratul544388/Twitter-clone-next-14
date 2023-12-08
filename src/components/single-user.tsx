"use client";
import { FullUserType } from "@/types";
import { Avatar } from "./avatar";
import { useRouter } from "next/navigation";
import FollowButton from "./follow-button";
import { User } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

interface UserProps {
  user: FullUserType;
  hasFollowButton?: boolean;
  currentUser: User;
  queryKey?: string;
  clickToProfile?: boolean;
}

export const SingleUser = ({
  user,
  hasFollowButton,
  currentUser,
  queryKey,
  clickToProfile,
}: UserProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => clickToProfile && router.push(`/${user.username}`)}
      key={user.id}
      className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50"
    >
      <Avatar
        image={user.image}
        onClick={() => router.push(`/${user.username}`)}
      />
      <div className="flex flex-col">
        <h1
          className="font-semibold cursor-pointer leading-4 hover:underline"
          onClick={() => router.push(`/${user.username}`)}
        >
          {user.name}
        </h1>
        <p className="text-muted-foreground">@{user.username}</p>
      </div>
      {hasFollowButton && queryKey && (
        <FollowButton
          user={user}
          currentUser={currentUser}
          className="ml-auto"
          queryKey={queryKey}
        />
      )}
    </div>
  );
};

SingleUser.Skeleton = function PeopleSkeleton({
  hasFollowButton,
  count,
  hasBio,
}: {
  count: number;
  hasFollowButton?: boolean;
  hasBio?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-4">
          <Avatar.Skeleton />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          {hasFollowButton && (
            <Skeleton className="h-8 w-20 ml-auto rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};
