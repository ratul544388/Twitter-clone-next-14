"use client";

import { Post } from "@/app/(main)/_components/post";
import { LoadingError } from "@/components/loading-error";
import { Separator } from "@/components/ui/separator";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface RepliesProps {
  tweet: FullTweetType;
  currentUser: User;
}

const Replies: React.FC<RepliesProps> = ({ tweet, currentUser }) => {
  const { ref, inView } = useInView();
  const queryKey = "TWEET_REPLIES";

  const fetchTweets = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: "/api/tweets",
      query: {
        cursor: pageParam,
        tweetId: tweet.id,
        type: queryKey,
      },
    });

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
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
    return <Post.Skeleton count={3} />;
  }

  if (status === "error") {
    return <LoadingError />;
  }

  return (
    <>
      {data?.pages?.map((page, i) => (
        <Fragment key={i}>
          {page.items.map((tweet: FullTweetType) => (
            <Fragment key={tweet.id}>
              <Post
                key={tweet.id}
                tweet={tweet}
                currentUser={currentUser}
                queryKey={queryKey}
                className="px-0 py-2"
              />
              <Separator />
            </Fragment>
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <div>{isFetchingNextPage && <Post.Skeleton count={3} />}</div>
      )}
      <div ref={ref} />
    </>
  );
};

export default Replies;
