import Icon from "@/components/icon";
import { useMutationHook } from "@/hooks/use-mutation-hook";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import RetweetButton from "./retweet-button";
import ShareButton from "./share-button";
import { useModal } from "@/hooks/use-modal-store";

interface ReactSectionProps {
  currentUser: User | null;
  tweet: FullTweetType;
  queryKey: string;
  refresh?: boolean;
  className?: string;
}

const ReactSection: React.FC<ReactSectionProps> = ({
  currentUser,
  tweet,
  queryKey,
  refresh,
  className,
}) => {
  const { onOpen } = useModal();
  const { mutate } = useMutationHook({
    method: "post",
    api: `/api/tweets/${tweet.id}/like`,
    queryKey,
    refresh,
  });

  const hasLike = tweet.likes.some((like) => like.id === currentUser?.id);

  const replies = tweet.retweets.filter((tweet) => tweet.isReply);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "flex justify-between ml-[42px] mt-2 text-muted-foreground",
        className
      )}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen("replyModal", { tweet });
        }}
        className={cn(
          "flex items-center cursor-pointer group hover:text-primary"
        )}
      >
        <Icon
          icon={MessageCircle}
          className=" group-hover:bg-sky-50"
          iconSize={20}
        />
        {replies.length}
      </div>
      <RetweetButton
        tweet={tweet}
        currentUser={currentUser}
        queryKey={queryKey}
        iconSize={20}
      />
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          mutate();
        }}
        className={cn(
          "flex items-center cursor-pointer group hover:text-rose-500",
          hasLike && "text-rose-500"
        )}
      >
        <Icon
          icon={hasLike ? AiFillHeart : AiOutlineHeart}
          className=" group-hover:bg-rose-50"
          iconSize={20}
        />
        {tweet.likes.length}
      </div>
      <ShareButton />
    </div>
  );
};

export default ReactSection;
