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

    if (userId === currentUser.id) {
      return new NextResponse("Users are not allowed to unFolow them self", {
        status: 403,
      });
    }

    const alreadyFollowing = await db.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: userId,
      },
    });

    if (!alreadyFollowing) {
      return new NextResponse("You are not permitted to unfollow the user", {
        status: 403,
      });
    }

    const unfollow = await db.follow.delete({
      where: {
        id: alreadyFollowing.id,
      },
    });

    return NextResponse.json(unfollow);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
