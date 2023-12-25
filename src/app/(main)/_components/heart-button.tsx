"use client";

import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import {
  InvalidateQueryFilters,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useOptimistic } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
  size?: number;
  tweet: FullTweetType;
  currentUser: User;
  queryKey?: string;
}

export const HeartButton = ({
  size = 22,
  tweet,
  currentUser,
  queryKey,
}: HeartButtonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [optimisticLike, addOptimisticLike] = useOptimistic(
    tweet.likes,
    (state: User[], newUser: User) =>
      state.some((user) => user.id === currentUser.id)
        ? state.filter((user) => user.id !== currentUser.id)
        : [...state, newUser]
  );

  useEffect(() => {
    const hasLike = optimisticLike.some((like) => like.id === currentUser.id);
    console.log(hasLike);
  }, [optimisticLike, currentUser.id]);

  const mutate = async () => {
    try {
      addOptimisticLike(currentUser);
      await axios.post(`/api/tweets/${tweet.id}/like`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      onClick={() => mutate()}
      className={cn(
        "flex items-center cursor-pointer group hover:text-rose-500",
        optimisticLike.some((like) => like.id === currentUser.id) &&
          "text-rose-500"
      )}
    >
      <Icon
        iconSize={size}
        icon={
          optimisticLike.some((like) => like.id === currentUser.id)
            ? AiFillHeart
            : AiOutlineHeart
        }
        className=" group-hover:bg-rose-50 dark:group-hover:bg-rose-900/10"
      />
      {optimisticLike.length}
    </div>
  );
};
