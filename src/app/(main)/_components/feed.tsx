"use client";

import TweetSkeletons from "@/components/skeletons/tweet-skeletons";
import { Separator } from "@/components/ui/separator";
import { FullTweetType, NavigationType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Post } from "./post";

interface FeedProps {
  currentUser: User;
  active: NavigationType;
  tweetId?: string;
  userId?: string;
}

const Feed: React.FC<FeedProps> = ({
  currentUser,
  active,
  tweetId,
  userId,
}) => {
  const { ref, inView } = useInView();

  const fetchTweets = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/tweets",
        query: {
          cursor: pageParam,
          type: active,
          tweetId,
          userId,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [active],
      queryFn: fetchTweets,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      initialPageParam: undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, inView]);

  if (status === "pending") {
    return (
      <TweetSkeletons count={7} photo={active === "MEDIA" ? true : false} />
    );
  }

  if (status === "error") {
    return "Something went wrong";
  }

  return (
    <div className="w-full">
      {data?.pages?.map((page, i) => (
        <Fragment key={i}>
          {page.tweets.map((tweet: FullTweetType) => (
            <Fragment key={tweet.id}>
              <Post
                key={tweet.id}
                tweet={tweet}
                currentUser={currentUser}
                queryKey={active}
              />
              <Separator />
            </Fragment>
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <div>
          {isFetchingNextPage && (
            <TweetSkeletons
              count={7}
              photo={active === "MEDIA" ? true : false}
            />
          )}
        </div>
      )}
      <div ref={ref} />
    </div>
  );
};

export default Feed;
