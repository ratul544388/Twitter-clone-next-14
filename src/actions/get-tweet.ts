"use server";

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
        },
      },
      community: true,
      likes: true,
      retweets: true,
      tweet: {
        include: {
          user: {
            include: {
              followers: true,
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
