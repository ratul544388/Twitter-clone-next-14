import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const alreadyFollowing = await db.follower.findUnique({
      where: {
        userId: userId,
        followerId: currentUser.id,
      },
    });

    const following = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        followings: {
          ...(alreadyFollowing
            ? {
                delete: {
                  followingId: userId,
                },
              }
            : {
                create: {
                  followingId: userId,
                },
              }),
        },
      },
    });

    const follower = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        followers: {
          ...(alreadyFollowing
            ? {
                delete: {
                  followerId: currentUser.id,
                },
              }
            : {
                create: {
                  followerId: currentUser.id,
                },
              }),
        },
      },
    });

    return NextResponse.json({ following, follower });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
