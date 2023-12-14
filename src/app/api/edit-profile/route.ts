import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const username = searchParams.get("username") as string;
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     const response = await db.user.findUnique({
//       where: {
//         username,
//         NOT: {
//           id: currentUser.id,
//         },
//       },
//     });

//     return NextResponse.json({
//       ...(response ? { isExist: true } : { isExist: false }),
//     });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const { name, username, bio, image, coverPhoto } = await req.json();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !username) {
      return new NextResponse("Name and username ara required", {
        status: 400,
      });
    }

    const isUsernameExist = await db.user.findUnique({
      where: {
        username,
        NOT: {
          id: currentUser.id,
        },
      },
    });

    if (isUsernameExist) {
      return new NextResponse(
        JSON.stringify({
          message: "This username name has already been taken",
        }),
        {
          status: 409,
        }
      );
    }

    const response = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        image,
        coverPhoto,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
