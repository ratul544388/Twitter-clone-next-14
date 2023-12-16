"use client";
import { useFollowing } from "@/hooks/use-following";
import { cn } from "@/lib/utils";
import { FullUserType } from "@/types";
import { User } from "@prisma/client";
import { Button } from "./ui/button";

interface FollowButtonProps {
  user: FullUserType;
  currentUser?: User;
  queryKey: string;
  className?: string;
}

export const FollowButton = ({
  user,
  currentUser,
  queryKey,
  className,
}: FollowButtonProps) => {
  const { isFollowing, mutate, isPending } = useFollowing({
    user: user,
    currentUser: currentUser!,
    queryKey,
  });

  return (
    <Button
      className={cn(className)}
      onClick={() => mutate()}
      disabled={isPending}
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};
