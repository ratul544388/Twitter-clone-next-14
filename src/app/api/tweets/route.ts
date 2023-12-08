import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NavigationType } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { caption, media } = await req.json();
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
    const type = searchParams.get("type") as NavigationType;
    const tweetId = searchParams.get("tweetId");
    const userId = searchParams.get("userId");

    const TWEETS_BATCH = 5;

    const tweets = await db.tweet.findMany({
      where: {
        ...(type === "FOLLOWING"
          ? {
              user: {
                followers: {
                  some: {
                    id: currentUser?.id,
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
            }
          : type === "REPLIES" && userId
          ? {
              OR: [{ isRetweet: true }, { isQuote: true }],
              userId,
            }
          : type === "MEDIA" && userId
          ? {
              media: {
                isEmpty: false,
              },
              userId,
            }
          : type === "TWEETS" && userId
          ? {
              isReply: false,
              isQuote: false,
              isRetweet: false,
              userId,
            }
          : type === "FOR YOU"
          ? {
              isReply: false,
            }
          : type === "REPLIES" && tweetId
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
