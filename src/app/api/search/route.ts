import db from "@/lib/db";
import { NavigationType } from "@/types";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") as string;
    const type = searchParams.get("type") as NavigationType;
    const take = Number(searchParams.get("take")) || 10;
    const cursor = searchParams.get("cursor");

    let response;

    if (type === "TWEETS" || type === "MEDIA") {
      response = await db.tweet.findMany({
        where: {
          OR: [
            {
              caption: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              user: {
                OR: [
                  {
                    username: {
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
              },
            },
          ],
          ...(type === "MEDIA"
            ? {
                media: {
                  isEmpty: false,
                },
              }
            : {}),
        },
        ...(cursor
          ? {
              skip: 1,
              cursor: {
                id: cursor,
              },
            }
          : {}),
        take,
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
    } else {
      response = await db.user.findMany({
        where: {
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
        },
        ...(cursor
          ? {
              skip: 1,
              cursor: {
                id: cursor,
              },
            }
          : {}),
        take,
        include: {
          followers: true,
        },
      });
    }

    let nextCursor = null;

    if (response.length === take) {
      nextCursor = response[take - 1].id;
    }

    return NextResponse.json({
      items: response,
      nextCursor,
    });

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
