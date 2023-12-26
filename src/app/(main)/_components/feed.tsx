"use client";
import { EmptyState } from "@/components/empty-state";
import { LoadingError } from "@/components/loading-error";
import { useInfinityTweets } from "@/hooks/use-infinity-tweets";
import {
  FullTweetType,
  InitialTweetsType,
  QueryType
} from "@/types";
import { User } from "@prisma/client";
import { Post } from "./post";

interface FeedProps {
  initialTweets?: InitialTweetsType;
  currentUser: User;
  type: QueryType;
  communityId?: string;
  tweetId?: string;
  userId?: string;
  media?: boolean;
  searchQuery?: boolean;
  limit?: number;
  q?: string;
}

export const Feed = ({
  initialTweets,
  currentUser,
  type,
  communityId,
  tweetId,
  userId,
  media,
  q,
  limit,
}: FeedProps) => {
  const { status, tweets, hasNextPage, isFetchingNextPage, isRefetching, ref } =
    useInfinityTweets({
      initialTweets,
      type,
      limit,
      userId,
      tweetId,
      communityId,
      q,
    });

  if (status === "pending") {
    return <Post.Skeleton count={5} media={media} />;
  }

  if (status === "error") {
    return <LoadingError />;
  }

  if (!tweets?.length) {
    return <EmptyState title="No tweets found" />;
  }

  return (
    <div>
      {tweets.map((tweet: FullTweetType) => (
        <Post key={tweet.id} tweet={tweet} currentUser={currentUser} queryKey={type} />
      ))}
      {hasNextPage ? (
        <div>
          {isFetchingNextPage && <Post.Skeleton count={7} media={media} />}
        </div>
      ) : (
        <EmptyState title="No more tweets to load" />
      )}
      <div ref={ref} />
    </div>
  );
};
