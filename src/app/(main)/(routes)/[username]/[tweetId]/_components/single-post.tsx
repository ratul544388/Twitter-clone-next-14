"use client";
import PostMenu from "@/app/(main)/_components/post-menu";
import { Avatar } from "@/components/avatar";
import ViewOnlyPost from "@/components/view-only-post";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { Repeat2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReplyInput from "./reply-input";
import SinglePostReactSection from "./single-post-react-section";
import Replies from "./replies";

interface SinglePostProps {
  tweet: FullTweetType;
  currentUser: User;
}

const SinglePost: React.FC<SinglePostProps> = ({ tweet, currentUser }) => {
  return (
    <div className="flex flex-col p-3 pb-1 relative">
      {tweet.isRetweet && (
        <div className="text-sm flex absolute gap-1 top-0.5 left-[48px] items-center text-muted-foreground">
          <Repeat2 className="h-3 w-3" />@{tweet.user.username} retweeted
        </div>
      )}
      <div
        className={cn("flex flex-col gap-3 w-full", tweet.isRetweet && "mt-3")}
      >
        <div className="flex items-center gap-3">
          <Avatar image={tweet.user.image} />
          <div className="flex flex-col">
            <Link
              href={`/${tweet.user.username}`}
              className="font-semibold line-clamp-1 leading-4 hover:underline"
            >
              {tweet.user.name}
            </Link>
            <p className="text-muted-foreground line-clamp-1">
              @{tweet.user.username}
            </p>
          </div>
          <PostMenu
            tweet={tweet}
            queryKey={"queryKey"}
            currentUser={currentUser}
          />
        </div>
        <p>{tweet.caption}</p>
        {!!tweet.media.length && (
          <div className="aspect-[5/5] flex items-center justify-center w-full h-full relative mt-3">
            <Image
              src={tweet.media[0]}
              alt="Photo"
              fill
              className="rounded-xl border object-cover"
            />
          </div>
        )}
      </div>
      {tweet.isQuote && tweet.tweet && (
        <ViewOnlyPost tweet={tweet.tweet} className="ml-0" />
      )}
      <SinglePostReactSection
        currentUser={currentUser}
        queryKey={"queryKey"}
        tweet={tweet}
      />
      <ReplyInput currentUser={currentUser} tweet={tweet} />
      <Replies tweet={tweet} currentUser={currentUser}/>
    </div>
  );
};

export default SinglePost;
