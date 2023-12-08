import getCurrentUser from "@/actions/get-current-user";
import { redirect } from "next/navigation";
import React from "react";
import Header from "../../_components/header";
import { ExploreClient } from "./explore-client";

const ExplorePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentUser = await getCurrentUser();
  const q = searchParams.q as string;

  return <ExploreClient currentUser={currentUser} q={q} />;
};

export default ExplorePage;
