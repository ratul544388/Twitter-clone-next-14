import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { tweetId: string } }
) {
  try {
    const response = await db.tweet.findUnique({
      where: {
        id: params.tweetId,
      },
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
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tweetId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const response = await db.tweet.delete({
      where: {
        id: params.tweetId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { tweetId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { caption, media } = await req.json();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const response = await db.tweet.update({
      where: {
        id: params.tweetId,
        userId: currentUser.id,
      },
      data: {
        caption,
        media,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
