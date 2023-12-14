import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { QueryType } from "@/types";
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
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const type = searchParams.get("type") as QueryType;
    const q = searchParams.get("q");
    const take = Number(searchParams.get("take")) || 10;
    const userId = searchParams.get("userId") as string;

    const currentUser = await getCurrentUser();

    const users = await db.user.findMany({
      where: {
        ...(q
          ? {
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
            }
          : type === "WHO_TO_FOLLOW"
          ? {
              id: {
                not: currentUser.id,
              },
            }
          : type === "FOLLOWERS"
          ? {
              followings: {
                some: {
                  followingId: userId,
                },
              },
            }
          : type === "FOLLOWINGS"
          ? {
              followers: {
                some: {
                  followerId: userId,
                },
              },
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
      orderBy: {
        createdAt: "desc",
      },
      include: {
        followers: true,
        followings: true,
      },
    });

    let nextCursor = null;

    if (users.length === take) {
      nextCursor = users[take - 1].id;
    }

    return NextResponse.json({
      items: users,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
