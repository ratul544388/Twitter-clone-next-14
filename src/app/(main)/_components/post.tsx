"use client";
import { Avatar } from "@/components/avatar";
import Dot from "@/components/dot";
import { MediaPreview } from "@/components/media/media-preview";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ViewOnlyPost from "@/components/view-only-post";
import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { Repeat2, Users2 } from "lucide-react";
import Link from "next/link";
import PostMenu from "./post-menu";
import ReactSection from "./react-section";
import { formatDistanceStrict } from "date-fns";
import { useRouter } from "next/navigation";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { checkBlueBadgeSubscription } from "@/lib/blue-badge-subscription";

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
  const router = useRouter();

  const post = tweet.isRetweet && tweet.tweet ? tweet.tweet : tweet;
  const time = formatDistanceStrict(new Date(), new Date(tweet.createdAt));

  const formattedTime = time.split(" ")[0] + time.split(" ")[1].split("")[0];

  return (
    <div className="flex flex-col relative hover:bg-accent/20 dark:hover:bg-accent/10">
      <div
        className={cn(
          "flex flex-col py-2 px-3 pb-1",
          (tweet.isRetweet || tweet.isCommunity) && "pt-4",
          className
        )}
      >
        <div
          onClick={() =>
            router.push(`/${post.user.username}/status/${post.id}?from=post`)
          }
        >
          <div className="absolute flex gap-3 top-0.5 left-[48px] line-clamp-1">
            {tweet.isCommunity && (
              <div className="text-sm flex gap-1 items-center text-muted-foreground">
                <Users2 className="h-3 w-3" /> {tweet.community?.name}
              </div>
            )}
            {tweet.isRetweet && (
              <div className="text-sm flex gap-1 items-center text-muted-foreground">
                <Repeat2 className="h-3 w-3" />@{tweet.user.username} reposted
              </div>
            )}
          </div>
          <div className={cn("flex items-start gap-3 mb-3")}>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={`/${post.user.username}`}
            >
              <Avatar image={post.user.image} size={38} />
            </Link>
            <div className="flex flex-col w-full overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    href={`/${tweet.user.username}`}
                    className="font-semibold line-clamp-1 hover:underline"
                  >
                    {post.user.name}
                  </Link>
                  {checkBlueBadgeSubscription(post.user) && (
                    <BiSolidBadgeCheck className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground line-clamp-1">
                  @{post.user.username}
                </p>
                <Dot />
                <p className="text-muted-foreground">{formattedTime}</p>
                <PostMenu
                  tweet={post}
                  queryKey={queryKey}
                  currentUser={currentUser}
                />
              </div>
              <div className="space-y-2">
                <p className="break-words">{post.caption}</p>
                <MediaPreview tweet={tweet} />
              </div>
            </div>
          </div>
          {tweet.tweet && tweet.isQuote && (
            <ViewOnlyPost tweet={tweet.tweet} className="ml-[50px]" />
          )}
        </div>
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
                style={{ height: "20px", width: getRandomSize(60, 80) }}
              />
              <Skeleton
                style={{ height: "20px", width: getRandomSize(60, 80) }}
              />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-6 w-6 rounded-full ml-auto" />
            </div>
            <Skeleton className="w-full h-5" />
            <Skeleton
              className="h-5"
              style={{ width: getRandomSize(40, 80, true) }}
            />
            {(index % 2 !== 0 || media) && (
              <Skeleton
                className="w-full"
                style={{ height: getRandomSize(230, 300) }}
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
