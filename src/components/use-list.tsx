"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { People } from "./poeple";
import FollowButton from "./follow-button";
import { Fragment } from "react";
import { FullUserType } from "@/types";
import { Avatar } from "./avatar";
import { User } from "@prisma/client";

interface UseListProps {
  queryKey: string;
  currentUser: User;
  take: number;
  hasFollowButton?: boolean;
  shouldFetchNextPage?: boolean;
}

const UseList: React.FC<UseListProps> = ({
  queryKey,
  currentUser,
  take,
  hasFollowButton,
  shouldFetchNextPage,
}) => {
  const router = useRouter();
  const fetchPeople = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/users",
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
    </div>
  );
};

export default UseList;
