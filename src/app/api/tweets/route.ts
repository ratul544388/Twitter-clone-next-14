import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { QueryType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { caption, media, communityId } = await req.json();
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!caption) {
      return new NextResponse("Caption is required", { status: 400 });
    }

    const tweet = await db.tweet.create({
      data: {
        userId: currentUser.id,
        caption,
        media,
        ...(communityId ? { communityId, isCommunity: true } : {}),
      },
    });

    return NextResponse.json(tweet);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const type = searchParams.get("type") as QueryType;
    const tweetId = searchParams.get("tweetId");
    const userId = searchParams.get("userId");
    const communityId = searchParams.get("communityId");
    const q = searchParams.get("q");

    const TWEETS_BATCH = 10;

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
      take: TWEETS_BATCH,
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
        user: true,
        tweet: {
          include: {
            user: true,
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

    if (tweets.length === TWEETS_BATCH) {
      nextCursor = tweets[TWEETS_BATCH - 1].id;
    }

    return NextResponse.json({
      items: tweets,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
