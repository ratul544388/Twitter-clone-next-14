"use client";
import { useMutationHook } from "@/hooks/use-mutation-hook";
import { cn } from "@/lib/utils";
import { FullUserType } from "@/types";
import { User } from "@prisma/client";
import { Button } from "./ui/button";

interface FollowButtonProps {
  user: FullUserType;
  currentUser: User;
  className?: string;
  queryKey: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  user,
  currentUser,
  className,
  queryKey,
}) => {
  const isFollowing = user.followers.some(
    (follower) => follower.followerId === currentUser.id
  );

  const { isPending, mutate } = useMutationHook({
    api: "/api/follow",
    method: "post",
    data: { userId: user.id },
    queryKey: queryKey,
    refresh: true,
    success: "Followed",
  });

  return (
    <Button
      disabled={isPending}
      className={cn(className)}
      onClick={() => mutate()}
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
