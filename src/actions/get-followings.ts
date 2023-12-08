"use server";

import db from "@/lib/db";

export async function getFollowings(userId: string) {
  const followings = await db.user.findMany({
    where: {
      followers: {
        some: {
          id: userId,
        }
      }
    },
  });

  return followings.length;
}
