import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { FollowersClient } from "../followers/followers-client";
import getCurrentUser from "@/actions/get-current-user";

const FollowingsPage = async ({ params }: { params: { username: string } }) => {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  const currentUser = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <FollowersClient
      user={user}
      active="FOLLOWINGS"
      currentUser={currentUser}
    />
  );
};

export default FollowingsPage;
