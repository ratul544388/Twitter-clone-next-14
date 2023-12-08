import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
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
    const take = Number(searchParams.get("take")) || 10;

    const people = await db.user.findMany({
      where: {
        followers: {
          none: {
            followerId: currentUser.id,
          },
        },
        id: {
          not: currentUser.id,
        },
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
      },
    });

    let nextCursor = null;

    if (people.length === take) {
      nextCursor = people[take - 1].id;
    }

    return NextResponse.json({
      items: people,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
