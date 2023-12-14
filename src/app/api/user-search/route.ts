import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") as string;

    const response = await db.user.findMany({
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
      take: 5,
    });

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
