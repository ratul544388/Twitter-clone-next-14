import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { HeartButton } from "./heart-button";
import { ReplyButton } from "./reply-button";
import RetweetButton from "./retweet-button";
import ShareButton from "./share-button";

interface ReactSectionProps {
  currentUser: User;
  tweet: FullTweetType;
  queryKey?: string;
  className?: string;
}

const ReactSection: React.FC<ReactSectionProps> = ({
  currentUser,
  tweet,
  queryKey,
  className,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "flex justify-between pl-[42px] text-muted-foreground",
        className
      )}
    >
      <ReplyButton tweet={tweet} queryKey={queryKey} />
      <RetweetButton
        tweet={tweet}
        currentUser={currentUser}
        queryKey={queryKey}
        iconSize={20}
      />
      <HeartButton
        tweet={tweet}
        currentUser={currentUser}
        size={20}
        queryKey={queryKey}
      />
      <ShareButton user={tweet.user} />
    </div>
  );
};

export default ReactSection;
