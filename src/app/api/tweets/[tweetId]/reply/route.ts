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
    const { caption, media } = await req.json();

    if (!caption) {
      return new NextResponse("Caption is required", { status: 400 });
    }

    const retweet = await db.tweet.update({
      where: {
        id: params.tweetId,
      },
      data: {
        retweets: {
          create: {
            caption,
            media,
            userId: currentUser.id,
            isReply: true,
          },
        },
      },
    });

    return NextResponse.json(retweet);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
