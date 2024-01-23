"use client";
import { User } from "@prisma/client";

import Icon from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { PencilLine, Repeat2 } from "lucide-react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RetweetButtonProps {
  currentUser: User | null;
  tweet: FullTweetType;
  queryKey?: string;
  iconSize?: number;
  hideNumber?: boolean;
}

const RetweetButton: React.FC<RetweetButtonProps> = ({
  tweet,
  currentUser,
  queryKey,
  iconSize,
  hideNumber,
}) => {
  const { onOpen } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/tweets/${tweet.id}/retweet`, {
        communityId: tweet.communityId,
        isReply: tweet.isReply,
      });
    },
    onSuccess: () => {
      toast.success("Success");
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

  const isRetweet = tweet.retweets.some(
    (tweet) => tweet.isRetweet && tweet.userId === currentUser?.id
  );

  const retweetCount = tweet.retweets.filter((tweet) => tweet.isRetweet).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center cursor-pointer group hover:text-green-500 outline-none select-none",
          isRetweet && "text-green-500"
        )}
      >
        <Icon
          iconSize={iconSize}
          icon={Repeat2}
          className=" group-hover:bg-green-50 dark:group-hover:bg-green-900/20"
        />
        {!hideNumber && retweetCount}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => mutate()}
          className={cn(isRetweet && "text-red-500")}
        >
          <Repeat2 className="h-4 w-4 mr-2" />
          {isRetweet ? "Undo retweet" : "Retweet"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onOpen("quoteTweetModal", {
              tweet,
              quote: tweet.mainTweet,
              queryKey,
            })
          }
        >
          <PencilLine className="h-4 w-4 mr-2" />
          Quote
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RetweetButton;
