import getCurrentUser from "@/actions/get-current-user";
import React from "react";
import { RecomendedClient } from "./recomended-client";

const CommunityRecomendedPage = async () => {
  const currentUser = await getCurrentUser();
  return <RecomendedClient currentUser={currentUser} />;
};

export default CommunityRecomendedPage;
