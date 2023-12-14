import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { FollowersClient } from "../followers/followers-client";

const FollowingsPage = async ({ params }: { params: { username: string } }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    notFound();
  }

  return <FollowersClient user={user} active="FOLLOWINGS" />;
};

export default FollowingsPage;
