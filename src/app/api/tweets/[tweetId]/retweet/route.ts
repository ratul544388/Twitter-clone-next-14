import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { tweetId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const isAlreadyRetweet = await db.tweet.findFirst({
      where: {
        id: params.tweetId,
        retweets: {
          some: {
            userId: currentUser.id,
            isRetweet: true,
          },
        },
      },
      include: {
        retweets: true,
      },
    });

    const retweet = await db.tweet.update({
      where: {
        id: params.tweetId,
      },
      include: {
        retweets: true,
      },
      data: {
        retweets: {
          ...(isAlreadyRetweet
            ? {
                deleteMany: {
                  userId: currentUser.id,
                  isRetweet: true,
                },
              }
            : {
                create: {
                  caption: "",
                  userId: currentUser.id,
                  isRetweet: true,
                },
              }),
        },
      },
    });

    return NextResponse.json(retweet);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
