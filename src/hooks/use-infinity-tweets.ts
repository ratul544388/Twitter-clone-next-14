import { getTweets } from "@/actions/get-tweets";
import { InitialTweetsType, QueryType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const useInfinityTweets = ({
  initialTweets,
  communityId,
  limit,
  type,
  tweetId,
  userId,
  q,
}: {
  initialTweets?: InitialTweetsType;
  type: QueryType;
  tweetId?: string;
  userId?: string;
  communityId?: string;
  limit?: number;
  q?: string;
}) => {
  const { inView, ref } = useInView();
  // console.log(type);
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    //@ts-ignore
  } = useInfiniteQuery({
    queryKey: [type],
    queryFn: async ({ pageParam = initialTweets?.nextCursor || undefined }) => {
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
    ...(initialTweets
      ? {
          initialData: () => {
            return {
              pages: [initialTweets],
              pageParams: [undefined],
            };
          },
        }
      : {
          initialPageParam: undefined,
        }),
    staleTime: 3600000,
    retry: 3,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const tweets = data?.pages.flatMap((page) => page.items);

  return {
    tweets,
    status,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    ref,
  };
};
