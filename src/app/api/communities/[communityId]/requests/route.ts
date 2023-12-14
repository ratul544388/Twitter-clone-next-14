import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const take = 10;

    const requests = await db.user.findMany({
      where: {
        communityRequestIds: {
          has: params.communityId,
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
    });

    let nextCursor = null;

    if (requests.length === take) {
      nextCursor = requests[take - 1].id;
    }

    return NextResponse.json({
      items: requests,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
