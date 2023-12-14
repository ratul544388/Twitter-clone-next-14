import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, coverPhoto, type } = await req.json();
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !coverPhoto || !type) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const response = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        communities: {
          create: {
            name,
            type,
            coverPhoto,
            members: {
              create: {
                role: "ADMIN",
                userId: currentUser.id,
              },
            },
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const q = searchParams.get("q");
    const take = 10;

    const communities = await db.community.findMany({
      where: {
        ...(q
          ? {
              name: {
                contains: q,
                mode: "insensitive",
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
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    let nextCursor = null;

    if (communities.length === take) {
      nextCursor = communities[take - 1].id;
    }

    return NextResponse.json({
      items: communities,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
