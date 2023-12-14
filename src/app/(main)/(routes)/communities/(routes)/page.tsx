import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { CommunitiesClient } from "../_components/communities-client";

const CommunitiesPage = async () => {
  const currentUser = await getCurrentUser();
  const communities = await db.community.findMany({
    where: {
      members: {
        some: {
          userId: currentUser.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      requestedUsers: true,
    },
  });

  return (
    <CommunitiesClient communities={communities} currentUser={currentUser} />
  );
};

export default CommunitiesPage;
