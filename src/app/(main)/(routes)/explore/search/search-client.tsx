"use client";

import Header from "@/app/(main)/_components/header";
import { Post } from "@/app/(main)/_components/post";
import { LoadingError } from "@/components/loading-error";
import { SingleUser } from "@/components/single-user";
import TweetSkeletons from "@/components/skeletons/tweet-skeletons";
import { FullTweetType, FullUserType, NavigationType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface SearchClientProps {
  q: string;
  currentUser: FullUserType;
}

export const SearchClient = ({ q, currentUser }: SearchClientProps) => {
  const navigations: NavigationType[] = ["TWEETS", "PEOPLE", "MEDIA"];
  const [active, setActive] = useState<NavigationType>("TWEETS");
  const { ref, inView } = useInView();

  const queryKey = `SEARCHED_${active}`;

  const fetchData = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: "/api/search",
      query: {
        q,
        type: active,
        cursor: pageParam,
      },
    });
    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchData,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      initialPageParam: undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, inView]);

  return (
    <div className="flex flex-col">
      <Header
        label="Explore"
        navigations={navigations}
        showBackButton
        active={active}
        onChange={(value) => setActive(value)}
        border
        hasSearchInput
        currentUser={currentUser}
        className="pt-1.5"
      />
      {status === "pending" ? (
        active === "TWEETS" ? (
          <Post.Skeleton count={6} />
        ) : (
          "Loading people..."
        )
      ) : status === "error" ? (
        <LoadingError />
      ) : (
        data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {active === "PEOPLE"
              ? page.items.map((user: FullUserType) => (
                  <SingleUser
                    key={user.id}
                    currentUser={currentUser}
                    queryKey={queryKey}
                    user={user}
                    hasFollowButton
                  />
                ))
              : page.items.map((tweet: FullTweetType) => (
                  <Post
                    key={tweet.id}
                    currentUser={currentUser}
                    queryKey={queryKey}
                    tweet={tweet}
                  />
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
