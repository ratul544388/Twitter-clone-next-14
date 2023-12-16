import { FullUserType } from "@/types";
import { Follow, User } from "@prisma/client";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useFollowing = ({
  user,
  currentUser,
  queryKey,
}: {
  user: User & {
    followers: Follow[];
  };
  currentUser: User;
  queryKey?: string;
}) => {
  const isFollowing = user.followers.some((follower) => {
    return follower.followerId === currentUser?.id;
  });

  const QueryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await axios.post(`/api/unfollow`, {
          userId: user.id,
        });
      } else {
        await axios.post(`/api/follow`, {
          userId: user.id,
        });
      }
    },
    onSuccess: () => {
      if (isFollowing) {
        toast.success(`You unfollowed @${user.username}`);
      } else {
        toast.success(`You followed @${user.username}`);
      }
      QueryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return { isFollowing, mutate, isPending };
};
