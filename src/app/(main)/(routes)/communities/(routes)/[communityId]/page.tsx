import db from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { CommunityIdClient } from "./communityId-client";
import getCurrentUser from "@/actions/get-current-user";

const CommunityIdPage = async ({
  params,
}: {
  params: { communityId: string };
}) => {
  const currentUser = await getCurrentUser();
  const community = await db.community.findUnique({
    where: {
      id: params.communityId,
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

  if (!community || !params.communityId) {
    redirect("/communities");
  }

  return <CommunityIdClient community={community} currentUser={currentUser} />;
};

export default CommunityIdPage;
