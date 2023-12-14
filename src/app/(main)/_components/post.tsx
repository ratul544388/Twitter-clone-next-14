"use client";
import { Avatar } from "@/components/avatar";
import Dot from "@/components/dot";
import ViewOnlyPost from "@/components/view-only-post";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { Repeat2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostMenu from "./post-menu";
import ReactSection from "./react-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MediaPreview } from "@/components/media/media-preview";

interface PostProps {
  currentUser: User;
  tweet: FullTweetType;
  queryKey?: string;
  className?: string;
}

export const Post = ({
  tweet,
  currentUser,
  queryKey,
  className,
}: PostProps) => {
  const post = tweet.isRetweet && tweet.tweet ? tweet.tweet : tweet;

  return (
    <div className="flex flex-col relative">
      <div
        className={cn(
          "flex flex-col py-2 px-3 pb-1",
          tweet.isRetweet && "pt-3",
          className
        )}
      >
        <Link href={`/${post.user.username}/status/${post.id}`}>
          {tweet.isRetweet && (
            <div className="text-sm flex absolute gap-1 top-0.5 left-[48px] items-center text-muted-foreground">
              <Repeat2 className="h-3 w-3" />@{tweet.user.username} reposted
            </div>
          )}
          <div
            className={cn(
              "flex items-start gap-3 mb-3",
              tweet.isRetweet && "mt-2"
            )}
          >
            <Link href={`/${post.user.username}`}>
              <Avatar image={post.user.image} />
            </Link>
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-2">
                <Link
                  href={`/${tweet.user.username}`}
                  className="font-semibold line-clamp-1 hover:underline"
                >
                  {post.user.name}
                </Link>
                <p className="text-muted-foreground line-clamp-1">
                  @{post.user.username}
                </p>
                <Dot />
                <p className="text-muted-foreground">10h</p>
                <PostMenu
                  tweet={tweet}
                  queryKey={queryKey}
                  currentUser={currentUser}
                />
              </div>
              <p>{post.caption}</p>
              <MediaPreview tweet={tweet} />
            </div>
          </div>
          {tweet.tweet && tweet.isQuote && <ViewOnlyPost tweet={tweet.tweet} />}
        </Link>
        <ReactSection
          currentUser={currentUser}
          tweet={post}
          queryKey={queryKey}
        />
      </div>
      <Separator />
    </div>
  );
};

Post.Skeleton = function PostSkeleton({
  count,
  media,
}: {
  count: number;
  media?: boolean;
}) {
  const getRandomSize = (min: number, max: number, parcent?: boolean) => {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${randomNumber}${parcent ? "%" : "px"}`;
  };

  return (
    <div className="p-3 flex flex-col gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 w-full">
          <Avatar.Skeleton />
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-3 w-full mt-1">
              <Skeleton
                style={{ height: "25px", width: getRandomSize(60, 80) }}
              />
              <Skeleton
                style={{ height: "25px", width: getRandomSize(60, 80) }}
              />
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-6 w-6 rounded-full ml-auto" />
            </div>
            <Skeleton className="w-full h-6" />
            <Skeleton
              className="h-6"
              style={{ width: getRandomSize(40, 80, true) }}
            />
            {(index % 2 !== 0 || media) && (
              <Skeleton
                className="w-full"
                style={{ height: getRandomSize(250, 320) }}
              />
            )}
            <div className="flex justify-between mt-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-9" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
