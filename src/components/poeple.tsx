"use client";
import qs from "query-string";

import { FullUserType } from "@/types";
import { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Avatar } from "./avatar";
import FollowButton from "./follow-button";
import { Skeleton } from "./ui/skeleton";
import { Loader2 } from "lucide-react";

interface PeopleProps {
  queryKey: string;
  take?: number;
  hasFollowButton?: boolean;
  currentUser: User;
}

export const People = ({
  queryKey,
  take,
  hasFollowButton,
  currentUser,
}: PeopleProps) => {
  const router = useRouter();
  const fetchPeople = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/people",
        query: {
          cursor: pageParam,
          take,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchPeople,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      initialPageParam: undefined,
    });

  if (status === "pending") {
    return <People.Skeleton hasFollowButton={hasFollowButton} count={3} />;
  }

  if (status === "error") {
    return "Something went wrong";
  }

  return (
    <div className="flex flex-col">
      {data?.pages?.map((page, index) => (
        <Fragment key={index}>
          {page.items.map((user: FullUserType) => (
            <div
              key={user.id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50"
            >
              <Avatar
                image={user.image}
                onClick={() => router.push(`/${user.username}`)}
              />
              <div className="flex flex-col">
                <h1
                  className="font-semibold cursor-pointer leading-4 hover:underline"
                  onClick={() => router.push(`/${user.username}`)}
                >
                  {user.name}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              {hasFollowButton && (
                <FollowButton
                  user={user}
                  currentUser={currentUser}
                  className="ml-auto"
                  queryKey={queryKey}
                />
              )}
            </div>
          ))}
        </Fragment>
      ))}
      {hasNextPage &&
        (isFetchingNextPage ? (
          <Loader2 className="h-7 w-7 animate-spin text-primary mx-auto" />
        ) : (
          <p
            onClick={() => fetchNextPage()}
            className="ml-3 select-none mt-3 text-muted-foreground text-sm cursor-pointer"
          >
            See more...
          </p>
        ))}
    </div>
  );
};

People.Skeleton = function PeopleSkeleton({
  hasFollowButton,
  count,
}: {
  hasFollowButton?: boolean;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-4">
          <Avatar.Skeleton />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          {hasFollowButton && (
            <Skeleton className="h-8 w-20 ml-auto rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};
