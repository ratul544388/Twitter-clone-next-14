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

interface RetweetButtonProps {
  currentUser: User | null;
  tweet: FullTweetType;
  queryKey: string;
  iconSize?: number;
  hideNumber?: boolean;
  refresh?: boolean;
}

const RetweetButton: React.FC<RetweetButtonProps> = ({
  tweet,
  currentUser,
  queryKey,
  iconSize,
  hideNumber,
  refresh,
}) => {
  const { onOpen } = useModal();

  // const { mutate } = useMutationHook({
  //   api: `/api/tweets/${tweet.id}/retweet`,
  //   method: "post",
  //   queryKey,
  //   success: "success",
  //   refresh,
  // });

  const isRetweet = tweet.retweets.some(
    (tweet) => tweet.isRetweet && tweet.userId === currentUser?.id
  );

  const retweetCount = tweet.retweets.filter((tweet) => tweet.isRetweet).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex items-center cursor-pointer group hover:text-green-500 outline-none select-none",
          isRetweet && "text-green-500"
        )}
      >
        <Icon
          iconSize={iconSize}
          icon={Repeat2}
          className=" group-hover:bg-green-50"
        />
        {!hideNumber && retweetCount}
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem
          className={cn(isRetweet && "text-red-500")}
        >
          <Repeat2 className="h-4 w-4 mr-2" />
          {isRetweet ? "Undo retweet" : "Retweet"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpen("quoteTweetModal", { tweet })}>
          <PencilLine className="h-4 w-4 mr-2" />
          Quote
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RetweetButton;
