import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

import db from "@/lib/db";
export default async function getCurrentUser() {
  try {
    const { userId } = auth();

    if (!userId) {
      return redirectToSignIn();
    }

    const user = await db.user.findUnique({
      where: {
        userId,
      },
      include: {
        followers: true,
        followings: true,
        blueBadgeSubscription: true,
      },
    });

    return user;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
