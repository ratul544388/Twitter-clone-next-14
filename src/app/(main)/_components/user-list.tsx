"use client";

import { LoadingError } from "@/components/loading-error";
import { SingleUser } from "@/components/single-user";
import { FullCommunityType, FullUserType, QueryType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import qs from "query-string";
import { Fragment, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
interface UserListProps {
  type: QueryType;
  api?: string;
  queryKey?: string;
  userId?: string;
  currentUser?: User;
  take?: number;
  hasBio?: boolean;
  hasFollowButton?: boolean;
  loadOnces?: boolean;
  searchQuery?: boolean;
  community?: FullCommunityType;
  hasApproveAndRejectButtons?: boolean;
  dropdownMenuForCommunityModerators?: boolean;
}

export const UserList = ({
  type,
  api = "/api/users",
  queryKey,
  userId,
  currentUser,
  take = 10,
  hasBio,
  hasFollowButton,
  loadOnces,
  searchQuery,
  community,
  hasApproveAndRejectButtons,
  dropdownMenuForCommunityModerators,
}: UserListProps) => {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const q = (searchQuery && searchParams.get("q")) || null;
  const isMounted = useRef(false);

  const fetchData = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: api,
        query: {
          q,
          type,
          cursor: pageParam,
          communityId: community?.id,
          take,
          userId,
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
    queryKey: [queryKey || type],
    queryFn: fetchData,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, inView]);

  useEffect(() => {
    if (searchQuery && isMounted.current) {
      refetch();
    }
    isMounted.current = true;
  }, [searchParams, searchQuery, refetch]);

  if (status === "pending") {
    return (
      <SingleUser.Skeleton
        count={take}
        hasBio={hasBio}
        hasFollowButton={hasFollowButton}
      />
    );
  }

  if (status === "error") {
    return <LoadingError />;
  }
  return (
    <>
      {data?.pages?.map((page, index) => (
        <Fragment key={index}>
          {page?.items?.map((user: FullUserType) => (
            <SingleUser
              key={user.id}
              currentUser={currentUser}
              queryKey={queryKey || type}
              user={user}
              hasFollowButton={hasFollowButton}
              hasBio={hasBio}
              community={community}
              hasApproveAndRejectButtons={hasApproveAndRejectButtons}
              dropdownMenuForCommunityModerators={
                dropdownMenuForCommunityModerators
              }
            />
          ))}
        </Fragment>
      ))}
      {hasNextPage && isFetchingNextPage && (
        <SingleUser.Skeleton count={take} />
      )}
      {!loadOnces && <div ref={ref} />}
    </>
  );
};
