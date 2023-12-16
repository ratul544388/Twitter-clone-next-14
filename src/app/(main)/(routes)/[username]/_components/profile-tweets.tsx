"use client";

import HeaderNavigations from "@/app/(main)/_components/header-navigations";
import { Post } from "@/app/(main)/_components/post";
import { LoadingError } from "@/components/loading-error";
import { FullTweetType, QueryType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ProfileTweetsProps {
  currentUser: User;
  user: User;
}

const ProfileTweets: React.FC<ProfileTweetsProps> = ({ currentUser, user }) => {
  const navigations: QueryType[] = ["TWEETS", "REPLIES", "LIKES", "MEDIA"];
  const [active, setActive] = useState<QueryType>("TWEETS");
  const { ref, inView } = useInView();

  const queryKey = `SEARCHED_${active}`;

  const fetchData = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: "/api/tweets",
      query: {
        userId: user.id,
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
    <div className="mt-3">
      <HeaderNavigations
        navigations={navigations}
        border
        active={active}
        onChange={(value) => setActive(value)}
      />
      {status === "pending" ? (
        <Post.Skeleton
          count={active === "MEDIA" ? 3 : 6}
          media={active === "MEDIA"}
        />
      ) : status === "error" ? (
        <LoadingError />
      ) : (
        data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page?.items?.map((tweet: FullTweetType) => (
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
            <Post.Skeleton
              count={7}
              media={active === "MEDIA" ? true : false}
            />
          )}
        </div>
      )}
      <div ref={ref} />
    </div>
  );
};

export default ProfileTweets;
