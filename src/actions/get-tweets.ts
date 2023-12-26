"use server";

import db from "@/lib/db";
import { QueryType } from "@/types";
import getCurrentUser from "./get-current-user";

export const getTweets = async ({
  cursor,
  type,
  limit,
  q,
  tweetId,
  userId,
  communityId,
}: {
  cursor?: string;
  type?: QueryType;
  limit?: number;
  tweetId?: string;
  userId?: string;
  q?: string;
  communityId?: string;
} = {}) => {
  try {
    const currentUser = await getCurrentUser();
    const take = limit || 10;
    const tweets = await db.tweet.findMany({
      where: {
        ...(type === "FOLLOWING"
          ? {
              user: {
                followers: {
                  some: {
                    followerId: currentUser?.id,
                  },
                },
              },
            }
          : type === "LIKES"
          ? {
              likes: {
                some: {
                  id: currentUser?.id,
                },
              },
              isReply: false,
              isCommunity: false,
            }
          : type === "REPLIES" && userId
          ? {
              OR: [{ isRetweet: true }, { isQuote: true }],
              userId,
              isReply: false,
              isCommunity: false,
            }
          : type === "MEDIA" && userId
          ? {
              media: {
                isEmpty: false,
              },
              userId,
              isReply: false,
              isCommunity: false,
            }
          : type === "TWEETS" && userId
          ? {
              isReply: false,
              isQuote: false,
              isRetweet: false,
              isCommunity: false,
              userId,
            }
          : type === "COMMUNITIES_TWEETS"
          ? {
              community: {
                members: {
                  some: {
                    userId: currentUser.id,
                  },
                },
              },
              isReply: false,
            }
          : type === "TWEETS" && communityId
          ? {
              isReply: false,
              communityId,
            }
          : type === "FOR YOU"
          ? {
              isReply: false,
              isCommunity: false,
            }
          : type === "REPLIES" && userId
          ? {
              OR: [
                {
                  isRetweet: true,
                },
                {
                  isQuote: true,
                },
              ],
            }
          : type === "TWEET_REPLIES" && tweetId
          ? {
              isReply: true,
              tweet: {
                id: tweetId,
              },
            }
          : (type === "TWEETS" || type === "MEDIA") && q
          ? {
              OR: [
                {
                  user: {
                    OR: [
                      {
                        name: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                      {
                        username: {
                          contains: q,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
                {
                  caption: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
              ...(type === "MEDIA"
                ? {
                    media: {
                      isEmpty: false,
                    },
                  }
                : {}),
            }
          : {}),
      },
      take,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              id: cursor,
            },
          }
        : {}),
      include: {
        retweets: true,
        likes: true,
        user: {
          include: {
            followers: true,
          },
        },
        community: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;

    if (tweets.length === take) {
      nextCursor = tweets[take - 1].id;
    }

    return { items: tweets, nextCursor };
  } catch (error) {
    console.log(error);
  }
};
