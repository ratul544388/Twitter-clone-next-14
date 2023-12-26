"use client";

import { getTweet } from "@/actions/get-tweet";
import Header from "@/app/(main)/_components/header";
import { Post } from "@/app/(main)/_components/post";
import { FullTweetType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import ReplyInput from "./_components/reply-input";
import Replies from "./_components/replies";
import { User } from "@prisma/client";

interface SingleTweetProps {
  tweet: FullTweetType;
  currentUser: User;
  queryKey: string;
}

export const SingleTweet = ({
  tweet,
  currentUser,
  queryKey,
}: SingleTweetProps) => {
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await getTweet({ tweetId: tweet.id });
      return response;
    },
    initialData: tweet,
    retry: 3,
    staleTime: 3600000,
  });

  return (
    <div className="flex flex-col">
      <Header label="Tweet" showBackButton border />
      <Post currentUser={currentUser} tweet={data!} queryKey={queryKey} />
      <ReplyInput tweet={tweet} currentUser={currentUser} />
      <Replies tweet={tweet} currentUser={currentUser} />
    </div>
  );
};
