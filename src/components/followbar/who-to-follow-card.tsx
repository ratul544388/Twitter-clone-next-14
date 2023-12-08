"use client";

import { User } from "@prisma/client";
import { People } from "../poeple";
import { FullUserType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Loader2 } from "lucide-react";
import { LoadingError } from "../loading-error";
import { SingleUser } from "../single-user";

interface WhoToFollowCardProps {
  currentUser: User;
}

const WhoToFollowCard: React.FC<WhoToFollowCardProps> = ({ currentUser }) => {
  const router = useRouter();
  const queryKey = "whoToFollow";
  const fetchPeople = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: "/api/people",
        query: {
          cursor: pageParam,
          take: 3,
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
    return <People.Skeleton hasFollowButton count={3} />;
  }

  if (status === "error") {
    return <LoadingError />;
  }
  return (
    <div className="border shadow-sm py-3 rounded-2xl flex flex-col gap-3">
      <h1 className="font-bold text-xl p-4 py-1 pb-0">Who to follow</h1>
      <div className="flex flex-col">
        {data?.pages?.map((page, index) => (
          <Fragment key={index}>
            {page.items.map((user: FullUserType) => (
              <SingleUser
                key={user.id}
                currentUser={currentUser}
                queryKey={queryKey}
                user={user}
                hasFollowButton
              />
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
    </div>
  );
};

export default WhoToFollowCard;
