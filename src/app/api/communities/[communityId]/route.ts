import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { name, coverPhoto, type } = await req.json();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !coverPhoto || !type) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const community = await db.community.findUnique({
      where: {
        id: params.communityId,
      },
      include: {
        members: true,
      },
    });

    const isAdmin = community?.members.some((member) => {
      return member.role === "ADMIN" && member.userId === currentUser.id;
    });

    if (!isAdmin) {
      return new NextResponse("Permission not allowed", { status: 403 });
    }

    const response = await db.community.update({
      where: {
        id: params.communityId,
      },
      data: {
        name,
        coverPhoto,
        type,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
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

    const isAdmin = community?.members.some((member) => {
      return member.role === "ADMIN" && member.userId === currentUser.id;
    });

    if (!isAdmin) {
      return new NextResponse("Permission not allowed", { status: 403 });
    }

    const response = await db.community.delete({
      where: {
        id: params.communityId,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
