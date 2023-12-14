import RetweetButton from "@/app/(main)/_components/retweet-button";
import ShareButton from "@/app/(main)/_components/share-button";
import Icon from "@/components/icon";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { MessageCircleIcon } from "lucide-react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface SinglePostReactSectionProps {
  tweet: FullTweetType;
  currentUser: User | null;
  queryKey: string;
}

const SinglePostReactSection: React.FC<SinglePostReactSectionProps> = ({
  tweet,
  currentUser,
  queryKey,
}) => {
  const { onOpen } = useModal();

  const hasLike = tweet.likes.some((like) => like.id === currentUser?.id);

  const replies = tweet.retweets.filter((tweet) => tweet.isReply).length;
  const retweets = tweet.retweets.filter((tweet) => tweet.isRetweet).length;
  const likes = tweet.likes.length;
  const quotes = tweet.retweets.filter((tweet) => tweet.isQuote).length;

  const reactCounts = [
    {
      isVisible: !!replies,
      label: "Replies",
      value: replies,
    },
    {
      isVisible: !!retweets,
      label: "Retweets",
      value: retweets,
    },
    {
      isVisible: !!quotes,
      label: "Quotes",
      value: quotes,
    },
    {
      isVisible: !!likes,
      label: "Likes",
      value: likes,
    },
  ];
  return (
    <div className="flex flex-col mt-3">
      {(!!replies || !!likes || !!retweets || !!quotes) && (
        <div className="border-y-[1.5px] xs:px-3 px-0 py-1.5 flex gap-4">
          {reactCounts.map(
            (count) =>
              count.isVisible && (
                <div key={count.label} className="flex items-center gap-1">
                  <h1 className="font-bold">{count.value}</h1>
                  {count.label}
                </div>
              )
          )}
        </div>
      )}
      <div
        className={cn(
          "flex justify-between py-1.5 border-b text-muted-foreground"
        )}
      >
        <div
          onClick={() => onOpen("replyModal", { tweet })}
          className={cn(
            "flex items-center cursor-pointer group hover:text-primary"
          )}
        >
          <Icon
            iconSize={22}
            icon={MessageCircleIcon}
            className=" group-hover:bg-sky-50"
          />
        </div>
        <RetweetButton
          tweet={tweet}
          currentUser={currentUser}
          queryKey={queryKey}
          iconSize={22}
          hideNumber
          refresh
        />
        <div
          className={cn(
            "flex items-center cursor-pointer group hover:text-rose-500",
            hasLike && "text-rose-500"
          )}
        >
          <Icon
            iconSize={22}
            icon={hasLike ? AiFillHeart : AiOutlineHeart}
            className=" group-hover:bg-rose-50"
          />
        </div>
        <ShareButton />
      </div>
    </div>
  );
};

export default SinglePostReactSection;
