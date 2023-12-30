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

    const community = await db.community.findUnique({
      where: {
        id: params.communityId,
      },
      include: {
        members: true,
      },
    });

    if (!community) {
      return new NextResponse("Community not found", { status: 400 });
    }

    const admin = community.members.find((member) => {
      return member.role === "ADMIN";
    });

    if (admin?.userId === currentUser.id) {
      return new NextResponse("Admin cannot leave the community", {
        status: 403,
      });
    }

    const response = await db.community.update({
      where: {
        id: community.id,
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
