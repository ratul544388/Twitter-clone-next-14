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
      return new NextResponse("Users are not allowed to follow them self", {
        status: 403,
      });
    }

    const alreadyFollowing = await db.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: userId,
      },
    });

    if (alreadyFollowing) {
      return new NextResponse("You are already following to this user", {
        status: 403,
      });
    }

    const follow = await db.follow.create({
      data: {
        followingId: userId,
        followerId: currentUser.id,
      },
    });

    return NextResponse.json(follow);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
