"use client";

import Icon from "@/components/icon";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { Tweet } from "@prisma/client";
import { MessageCircle } from "lucide-react";

interface ReplyButtonProps {
  tweet: FullTweetType;
  refresh?: boolean;
  queryKey?: string;
}

export const ReplyButton = ({ tweet, refresh, queryKey }: ReplyButtonProps) => {
  const { onOpen } = useModal();

  const replies = tweet.retweets.filter((tweet) => tweet.isReply);
  return (
    <div
      onClick={(e) => {
        onOpen("replyModal", { tweet, queryKey });
      }}
      className={cn(
        "flex items-center cursor-pointer group hover:text-primary"
      )}
    >
      <Icon
        icon={MessageCircle}
        className=" group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20"
        iconSize={20}
      />
      {replies.length}
    </div>
  );
};
