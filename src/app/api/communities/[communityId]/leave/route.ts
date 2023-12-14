import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const response = await db.community.update({
      where: {
        id: params.communityId,
      },
      data: {
        members: {
          deleteMany: {
            userId: currentUser.id,
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
