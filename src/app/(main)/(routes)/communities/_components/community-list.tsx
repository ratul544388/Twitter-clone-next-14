"use client";

import { FullCommunityType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import { Fragment, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { LoadingError } from "../../../../../components/loading-error";
import { CommunityCard } from "./community-card";
import { cn } from "@/lib/utils";

interface CommunityListProps {
  variant?: "COLUMN" | "ROW";
}

export const CommunityList = ({ variant = "COLUMN" }: CommunityListProps) => {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const isMounted = useRef(false);

  const fetchTweets = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/communities",
        query: {
          cursor: pageParam,
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
  } = useInfiniteQuery({
    queryKey: ["communities"],
    queryFn: fetchTweets,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, inView]);

  useEffect(() => {
    if (isMounted.current) {
      refetch();
    }
    isMounted.current = true;
  }, [searchParams, refetch]);

  if (status === "pending") {
    return <CommunityCard.Skeleton count={5} />;
  }

  if (status === "error") {
    return <LoadingError />;
  }
  return (
    <>
      {data?.pages?.map((page, i) => (
        <div
          className={cn(
            variant === "ROW" &&
              "flex overflow-x-auto overflow-y-hidden scrollbar-thin gap-3 px-3"
          )}
          key={i}
        >
          {page?.items?.map((community: FullCommunityType) => (
            <Fragment key={community.id}>
              <CommunityCard community={community} />
            </Fragment>
          ))}
        </div>
      ))}
      {hasNextPage && <div>{isFetchingNextPage && "loading..."}</div>}
      <div ref={ref} />
    </>
  );
};
