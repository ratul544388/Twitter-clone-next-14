import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string; memberId: string } }
) {
  try {
    const { communityId, memberId } = params;
    const { role } = await req.json();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!role) {
      return new NextResponse("Role is required", { status: 401 });
    }

    if (!communityId || !memberId) {
      return new NextResponse("Community Id or Member Id or both are missing", {
        status: 400,
      });
    }

    const community = await db.community.findUnique({
      where: {
        id: communityId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!community) {
      return new NextResponse("Community not found", { status: 400 });
    }

    const admin = community.members.find((member) => {
      return member.userId === currentUser.id && member.role === "ADMIN";
    });

    if (!admin) {
      return new NextResponse(
        "Members or Moderators are not permitted to change community member's role. Only admin can change the role",
        { status: 403 }
      );
    }

    const response = await db.community.update({
      where: {
        id: communityId,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role,
            },
          },
        },
      },
    });

    if (role === "ADMIN") {
      await db.community.update({
        where: {
          id: communityId,
        },
        data: {
          members: {
            update: {
              where: {
                id: admin.id,
              },
              data: {
                role: "MODERATOR",
              },
            },
          },
        },
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
