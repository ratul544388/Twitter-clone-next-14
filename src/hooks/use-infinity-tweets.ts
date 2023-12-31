import { getTweets } from "@/actions/get-tweets";
import { QueryType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useInfinityTweets = ({
  communityId,
  limit,
  type,
  tweetId,
  userId,
  q,
}: {
  type: QueryType;
  tweetId?: string;
  userId?: string;
  communityId?: string;
  limit?: number;
  q?: string;
}) => {
  const { inView, ref } = useInView();
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [type],
    //@ts-ignore
    queryFn: async ({ pageParam = undefined }) => {
      const response = await getTweets({
        cursor: pageParam,
        type,
        limit,
        q,
        tweetId,
        userId,
        communityId,
      });
      return response;
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);


  const tweets = data?.pages.flatMap((page: any) => page.items);

  return {
    tweets,
    status,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    ref,
  };
};
