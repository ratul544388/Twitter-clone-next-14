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

    const isAlreadyLiked = await db.tweet.findFirst({
      where: {
        id: params.tweetId,
        likes: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    const like = await db.tweet.update({
      where: {
        id: params.tweetId,
      },
      data: {
        likes: {
          ...(isAlreadyLiked
            ? {
                disconnect: {
                  id: currentUser.id,
                },
              }
            : {
                connect: {
                  id: currentUser.id,
                },
              }),
        },
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
