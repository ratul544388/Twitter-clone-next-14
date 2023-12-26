import getCurrentUser from "@/actions/get-current-user";
import React from "react";
import { BlueBadgeClient } from "./blue-badge-client";

const BlueBadgePage = async () => {
  const currentUser = await getCurrentUser();

  return <BlueBadgeClient currentUser={currentUser} />;
};

export default BlueBadgePage;
