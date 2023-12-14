"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Post } from "./post";
import { LoadingError } from "@/components/loading-error";
import { Separator } from "@/components/ui/separator";
import { FullCommunityType, FullTweetType, QueryType } from "@/types";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";

interface FeedProps {
  queryKey?: string;
  currentUser: User;
  type: QueryType;
  community?: FullCommunityType;
  tweetId?: string;
  userId?: string;
  media?: boolean;
  searchQuery?: boolean;
}

export const Feed = ({
  queryKey,
  currentUser,
  type,
  community,
  tweetId,
  userId,
  media,
  searchQuery,
}: FeedProps) => {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const q = searchQuery ? searchParams.get("q") : null;

  const fetchTweets = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/tweets",
        query: {
          cursor: pageParam,
          type,
          communityId: community?.id,
          tweetId,
          userId,
          q,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [queryKey || type],
    queryFn: fetchTweets,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (q) {
      refetch();
    }
  }, [q, refetch]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, inView]);

  if (status === "pending") {
    return <Post.Skeleton count={5} media={media} />;
  }

  if (status === "error") {
    return <LoadingError />;
  }

  return (
    <div>
      {data?.pages?.map((page, i) => (
        <Fragment key={i}>
          {page?.items?.map((tweet: FullTweetType) => (
            <Fragment key={tweet.id}>
              <Post
                key={tweet.id}
                tweet={tweet}
                currentUser={currentUser}
                queryKey={queryKey || type}
              />
              <Separator />
            </Fragment>
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <div>
          {isFetchingNextPage && <Post.Skeleton count={7} media={media} />}
        </div>
      )}
      <div ref={ref} />
    </div>
  );
};
