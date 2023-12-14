import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { QueryType } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const type = searchParams.get("type") as QueryType;
    const take = 10;

    const members = await db.member.findMany({
      where: {
        communityId: params.communityId,
        ...(type === "COMMUNITY_MODERATORS"
          ? {
              OR: [{ role: "ADMIN" }, { role: "MODERATOR" }],
            }
          : type === "COMMUNITY_MEMBERS"
          ? { role: "MEMBER" }
          : {}),
      },
      include: {
        user: {
          include: {
            followers: true,
          },
        },
      },
      orderBy: {
        role: "asc",
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
    });

    let nextCursor = null;

    if (members.length === take) {
      nextCursor = members[take - 1].id;
    }

    const users = members.map((member) => member.user);

    return NextResponse.json({
      items: users,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
