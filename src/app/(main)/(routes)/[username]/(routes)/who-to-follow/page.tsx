import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import React from "react";
import { WhoToFollowClient } from "./who-to-follow-client";

const WhoToFollowPage = async () => {
  const currentUser = await getCurrentUser();
  return <WhoToFollowClient currentUser={currentUser} />;
};

export default WhoToFollowPage;
