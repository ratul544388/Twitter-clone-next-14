"use server";

import TweetSkeletons from "@/components/skeletons/tweet-skeletons";
import db from "@/lib/db";

export const getTweet = async ({ tweetId }: { tweetId: string }) => {
  const tweet = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
    include: {
      user: {
        include: {
          followers: true,
          blueBadgeSubscription: true,
        },
      },
      community: true,
      likes: true,
      retweets: true,
      mainTweet: {
        include: {
          user: {
            include: {
              followers: true,
              blueBadgeSubscription: true,
            },
          },
          likes: true,
          retweets: true,
        },
      },
    },
  });

  return tweet;
};
