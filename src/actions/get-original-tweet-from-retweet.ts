"use server";

import db from "@/lib/db";

export async function getOriginalTweetFromRetweet(tweetId: string) {
  const response = await db.tweet.findFirst({
    where: {
      retweets: {
        some: {
          id: tweetId,
        },
      },
    },
    include: {
      retweets: true,
      likes: true,
      user: true,
    },
  });

  return response;
}
