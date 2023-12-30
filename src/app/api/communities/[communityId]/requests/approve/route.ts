import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { userId } = await req.json();
    const response = await db.community.update({
      where: {
        id: params.communityId,
      },
      data: {
        members: {
          create: {
            userId,
          },
        },
        requestedUsers: {
          disconnect: {
            id: userId,
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
