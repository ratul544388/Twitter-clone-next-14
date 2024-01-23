"use client";
import Icon from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFollowing } from "@/hooks/use-following";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { Edit, MoreHorizontal, Trash, UserCheck2, UserX2 } from "lucide-react";

interface PostMenuProps {
  currentUser: User;
  tweet: FullTweetType;
  queryKey?: string;
}

const PostMenu: React.FC<PostMenuProps> = ({
  tweet,
  queryKey,
  currentUser,
}) => {
  const { onOpen } = useModal();

  const { isFollowing, mutate, isPending } = useFollowing({
    user: tweet.user,
    currentUser,
    queryKey,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="ml-auto outline-none"
      >
        <Icon
          icon={MoreHorizontal}
          className="text-muted-foreground"
          iconSize={16}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
        {currentUser.id === tweet.user.id ? (
          <>
            <DropdownMenuItem
              className={cn(tweet.isQuote && "hidden")}
              onClick={() => onOpen("tweetModal", { tweet, queryKey })}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => onOpen("deleteTweetModal", { tweet, queryKey })}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => mutate()} disabled={isPending}>
              {isFollowing ? (
                <UserX2 className="h-4 w-4 mr-2" />
              ) : (
                <UserCheck2 className="h-4 w-4 mr-2" />
              )}
              {isFollowing
                ? `Unfollow @${tweet.user.username}`
                : `Follow @${tweet.user.username}`}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
