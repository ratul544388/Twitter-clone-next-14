import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import db from "./db";

export async function initialProfile() {
  try {
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const existingUser = await db.user.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        followers: true,
        followings: true,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await db.user.create({
      data: {
        userId: user.id,
        image: user.imageUrl,
        name: `${user.firstName} ${user.lastName}`,
        username: `${user.username}`,
        email: user.emailAddresses[0].emailAddress,
      },
      include: {
        followers: true,
        followings: true,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}
