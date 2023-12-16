"use client";

import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
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
  const hasLike = tweet.likes.some((like) => like.id === currentUser.id);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/tweets/${tweet.id}/like`);
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      } else {
        router.refresh();
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div
      onClick={() => mutate()}
      className={cn(
        "flex items-center cursor-pointer group hover:text-rose-500",
        hasLike && "text-rose-500"
      )}
    >
      <Icon
        iconSize={size}
        icon={hasLike ? AiFillHeart : AiOutlineHeart}
        className=" group-hover:bg-rose-50"
      />
      {tweet.likedUserIds.length}
    </div>
  );
};
