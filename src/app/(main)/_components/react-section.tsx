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

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "flex justify-between pl-[42px] text-muted-foreground",
        className
      )}
    >
      <ReplyButton tweet={tweet} queryKey={queryKey} refresh/>
      <RetweetButton
        tweet={tweet}
        currentUser={currentUser}
        queryKey={queryKey}
        iconSize={20}
      />
      <HeartButton tweet={tweet} currentUser={currentUser} size={20} />
      <ShareButton />
    </div>
  );
};

export default ReactSection;
