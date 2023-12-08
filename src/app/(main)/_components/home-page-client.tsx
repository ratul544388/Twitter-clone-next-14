"use client";

import { LoadingError } from "@/components/loading-error";
import TweetSkeletons from "@/components/skeletons/tweet-skeletons";
import TweetInput from "@/components/tweet-input";
import { Separator } from "@/components/ui/separator";
import { FullTweetType, FullUserType, NavigationType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Header from "./header";
import { Post } from "./post";

interface HomePageClientProps {
  currentUser: FullUserType;
}

const HomePageClient: React.FC<HomePageClientProps> = ({ currentUser }) => {
  const navigations: NavigationType[] = ["FOR YOU", "FOLLOWING"];
  const [active, setActive] = useState<NavigationType>("FOR YOU");

  const { ref, inView } = useInView();

  const fetchTweets = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: "/api/tweets",
      query: {
        cursor: pageParam,
        type: active,
      },
    });

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

  return (
    <div className="h-full">
      <Header
        label="Home"
        navigations={navigations}
        border
        active={active}
        onChange={(value) => setActive(value)}
        mobileSidebar
        currentUser={currentUser}
      />
      <TweetInput currentUser={currentUser} />
      {status === "pending" ? (
        <Post.Skeleton count={6} />
      ) : status === "error" ? (
        <LoadingError />
      ) : (
        data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((tweet: FullTweetType) => (
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
        ))
      )}
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

export default HomePageClient;
